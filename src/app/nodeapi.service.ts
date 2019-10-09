
import { Injectable } from '@angular/core';

import * as dirtree from 'directory-tree';
import Filetree from './filetree';

import * as path_os from 'path';




@Injectable({
  providedIn: 'root'
})
export class NodeapiService {

  tree: any;

  file_tree: Filetree;

  constructor() { }


   async createFileTree(path) {

    let file_tree: any = dirtree(path);

    file_tree.label = file_tree.name;

    this.arraylabel(file_tree.children);

    this.tree = [file_tree];






  }

  arraylabel(array) {

    array.forEach(element => {

      element.label = element.name;

      if (element.children) {
        this.arraylabel(element.children);
        element.expandedIcon = 'fa fa-folder-open';
        element.collapsedIcon = 'fa fa-folder';
      }

      element.icon = 'fa fa-file-word-o';

    });


  }

  getFileTree() {

    return this.tree;

  }

  createtree(path) {
    this.file_tree = new Filetree(path, path_os.basename(path));
    this.file_tree.build();
    
  }

  returntree() {

    return this.file_tree;
    
  }

}


