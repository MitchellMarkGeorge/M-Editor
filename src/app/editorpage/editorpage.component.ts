import { TreeNode } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import * as process from 'process';


import { remote } from 'electron';

import * as codemirror from 'codemirror';
import { Tree } from 'primeng/tree';

import * as dirtree from 'directory-tree';
import { NodeapiService } from '../nodeapi.service';






@Component({
  selector: 'app-editorpage',
  templateUrl: './editorpage.component.html',
  styleUrls: ['./editorpage.component.scss']
})
export class EditorpageComponent implements OnInit {
  project_map: any;
  project_path;
  final_tree: any;
  filetreeVisible: boolean = false;
  tree = undefined;



  constructor( public nodeservice: NodeapiService ) { }

  ngOnInit() {

    // resize window
    this.resize();


    // this.route.queryParamMap.subscribe( param => {
    //   this.project_map = param;
    // });

    // console.log(this.project_path);

    // this.project_path = this.project_map.params.path;

    // console.table(this.project_path);



    

    console.log(this.tree);

    // this.tree = this.nodeservice.returntree();






    // monaco editor

    // monaco.editor.create(document.getElementById("container"), {
    //   // test config
    //   language: 'javascript',
    //   theme: 'vs',
    //   automaticLayout: true
    // });

    // let something = this.makeFileTree(this.project_path);

    // console.log(something);

    let options = { lineNumbers: true,
    theme: 'darcula',
    // theme: 'material'
    mode: 'javascript',
    autocorrect: true,
    spellcheck: true
  };

    let editor = codemirror(document.getElementById('editor'), options);


    // this.final_tree = dirtree(this.project_path);
    // this.final_tree.label = this.final_tree.name.name;
    // this.final_tree.icon = 'fa fa-folder';

    //let arr = {data: [this.final_tree]};

    console.log(this.final_tree);

    // this.getDirTree().then(() => {

    //   this.final_tree.label = this.final_tree.name.name;
    //   this.final_tree.icon = 'fa fa-folder';



    //   this.arraylabel(this.final_tree.children);

    //   let arr = [this.final_tree];

    //   console.log(arr);

    //   this.tree = arr;
    // });

    //setTimeout()

    // this.final_tree.children.forEach(element => {

    //   element.label = element.name;
    //   if (element.type = 'directory') {
    //     element.icon = 'fa fa-folder';
    //   }

    //   element.icon = 'fa fa-file';

    // });

    // this.arraylabel(this.final_tree.children);

    // let arr = [this.final_tree];

    // console.log(arr);

    // this.tree = arr;

    // setInterval(() => {
    //   this.getDirTree();
    // }, 3000);

    console.log('done');







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


  resize() {

    remote.getCurrentWindow().maximize();

  }

  toggleFiletree() {

    this.filetreeVisible = !this.filetreeVisible;

    // if (this.tree === undefined) {
    //   console.log('hello');
    //   this.getDirTree();
    // }






  }

  async getDirTree() {

    // error here  - figure out why

    this.final_tree = dirtree(this.project_path);

    console.log(this.final_tree);

  }


  // makeFileTree(project_path) {

  //   fs.readdir(project_path, (err, files) => {
  //     if (files) {
  //       return files.forEach(file => {
  //         let file_path = path.join(project_path, file);
  //         fs.stat(file_path, (err, stats) => {
  //           let fileobj: TreeNode | any = {};
  //           // fileobj.label = path.basename(file_path);
  //           fileobj.label = path.basename(file_path);
  //           fileobj.isDirectory = stats.isDirectory;
  //           fileobj.path = file_path;
  //           fileobj.icon = 'fa fa-file';
  //           if (fileobj.isDirectory) {
  //             fileobj.icon = 'fa fa-folder';
  //             fileobj.children = this.makeFileTree(file_path);
  //           }

  //           //console.log(fileobj);
  //         });
  //       });

  //       console.log(files);
  //     }
  //   });





  // }



}
