import * as fs from 'fs';

import * as path_os from 'path';

import * as os from 'os';

import * as code from 'codemirror';



export default class Filetree {

  path: string;
  label: string;
  children;
  document;
  // add icons
  // create codemirrot documents for each file



  constructor(path, name = null) {
    this.path = path;
    this.label = name;
    this.children = [];


  }






  static readDir(path) {
    let fileArray = [];

    fs.readdirSync(path).forEach(file => {
      let file_path = path_os.join(path, file);
      let file_info = new Filetree(file_path, file);

      //let stat = fs.statSync(file_info.path);

      // make all fs methods async

      fs.stat(file_info.path, (err, stat) => {if (stat){

        if (stat.isDirectory()) {
          file_info.children = Filetree.readDir(file_info.path);
          delete file_info.document;

        } else if (stat.isFile()) {
          delete file_info.children;

        fs.readFile(file_path, 'utf8',  (err, file) => {if (file) { file_info.document = file; }});
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

  build() {

  this.children = Filetree.readDir(this.path);

   }


}
