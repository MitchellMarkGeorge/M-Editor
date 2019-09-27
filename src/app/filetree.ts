import * as fs from 'fs';

import * as path_os from 'path';

import * as os from 'os';

import * as code from 'codemirror';



export default class Filetree {


  // add icons
  // create codemirrot documents for each file



  constructor(path, name = null) {
    this.path = path;
    this.label = name;
    this.children = [];


  }

  path: string;
  label: string;
  children;
  document;
  mode;
  selectable;






  static readDir(path) {
    let fileArray = [];
    let inital_array = fs.readdirSync(path);

    // dont load node_modules files OR .git (do i need to remove .git???)
    if (inital_array.includes('node_modules')) {
      // let node_modules_index = inital_array.indexOf('node_modules');
      // if (node_modules_index !== -1) {
      //   inital_array.splice(node_modules_index, 1);
      // }

      // why does removeItem have to be static

      this.removeItem(inital_array, 'node_modules');

    }

    if (inital_array.includes('.git')) {

      this.removeItem(inital_array, '.git');
    }

    if (inital_array.includes('.idea')) {

      this.removeItem(inital_array, '.idea');
    }

    if (inital_array.includes('.vscode')) {

      this.removeItem(inital_array, '.vscode');
    }


    inital_array.forEach(file => {
      let file_path = path_os.join(path, file);
      let file_info = new Filetree(file_path, file);

      //let stat = fs.statSync(file_info.path);;

      // make all fs methods async

      fs.stat(file_info.path, (err, stat) => {if (stat){

        if (stat.isDirectory()) {

          file_info.children = Filetree.readDir(file_info.path);
          file_info.selectable = false;


        } else if (stat.isFile()) {

          delete file_info.children;

          file_info.selectable = true;


          fs.readFile(file_path, (err, file) => {
            if (file) { // scss and css files failin here (files with names like app.component.css)
            let text = file.toString();
            file_info.mode = code.findModeByFileName(file_info.label);


            file_info.document = code.Doc(text, file_info.mode);
            // code.modeURL = "node_modules/codemirror/mode/%N/%N.js"
            // code.requireMode(file_info.mode.mode, () => {
            //   console.log("done! mode loaded");
            //     });

          } else if (err) {
            console.error(err)

          }

        });
          // file_info.document = data;
        }

        // should i still do this???


      fileArray.push(file_info);


      }});

    //   if (stat.isDirectory()) {
    //     file_info.children = Filetree.readDir(file_info.path);
    //     delete file_info.document;

    //   } else if (stat.isFile()) {
    //     delete file_info.children;

    //   fs.readFile(file_path, (err, file) => {if (file) { file_info.document = file.toString() }});
    //     // file_info.document = data;
    //   }

    //   // should i still do this???


    // fileArray.push(file_info);


    });

    return fileArray;
  }

   static removeItem(arr, item) {
     let index = arr.indexOf(item);

     if (index !== -1) {
       arr.splice(index, 1);
     }

   }

  build() {

    this.children = Filetree.readDir(this.path);

  }


}
