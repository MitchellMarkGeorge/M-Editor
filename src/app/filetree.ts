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
  expanded: boolean;






  static readDir(path) {
    let fileArray = [];

    let inital_array = fs.readdirSync(path);
    //console.log(inital_array);

    if (inital_array.length === 0) {
      console.log('empty arr');
    }

    // dont load node_modules files OR .git (do i need to remove .git???)
    if (inital_array.includes('node_modules')) {
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
	
	if (inital_array.includes('.DS_Store')) {
	  this.removeItem(inital_array, '.DS_Store');
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
            if (file) { 
            let text = file.toString();
            file_info.mode = code.findModeByFileName(file_info.label);


            file_info.document = code.Doc(text, file_info.mode);
            // code.modeURL = "node_modules/codemirror/mode/%N/%N.js"
            // code.requireMode(file_info.mode.mode, () => {
            //   console.log("done! mode loaded");
            //     });

          } else if (err) {
            console.error(err);

          }

        });
          // file_info.document = data;
        } else if(err){
          console.log(err);
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
    console.log('building')

    this.children = Filetree.readDir(this.path);

  }


}
