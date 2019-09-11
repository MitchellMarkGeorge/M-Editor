import * as fs from 'fs';

import * as path_os from 'path';

import * as os from 'os';

import * as code from 'codemirror';



export default class Filetree {

  path: string;
  label: string;
  children;



  constructor(path, name = null) {
    this.path = path;
    this.label = name;
    this.children = [];


  }






  static readDir(path) {
    let fileArray = [];

    fs.readdirSync(path).forEach(file => {
      let file_info = new Filetree(path_os.join(path, file), file);

      let stat = fs.statSync(file_info.path);

      if (stat.isDirectory()) {
        file_info.children = Filetree.readDir(file_info.path);

      } else if (stat.isFile()) {
        delete file_info.children;
      }

      // should i still do this???


    fileArray.push(file_info);


    });

    return fileArray;
  }

  build() {

  this.children = Filetree.readDir(this.path);

   }


}
