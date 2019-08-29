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




@Component({
  selector: 'app-editorpage',
  templateUrl: './editorpage.component.html',
  styleUrls: ['./editorpage.component.scss']
})
export class EditorpageComponent implements OnInit {
  project_map: any;
  project_path;
  final_tree: TreeNode[];
  filetreeVisible: boolean = true;



  constructor(public route: ActivatedRoute) { }

  ngOnInit() {

    // resize window
    this.resize();


    this.route.queryParamMap.subscribe( param => {
      this.project_map = param;
    });

    console.log(this.project_path);

    this.project_path = this.project_map.params.path;

    console.table(this.project_path);




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




  }

  
  resize() {

    remote.getCurrentWindow().maximize();

  }

  toggleFiletree() {
    this.filetreeVisible = !this.filetreeVisible;
  }


  makeFileTree(path) {

    fs.readdir(path, (err, files) => {
      if (files) {
        files.forEach(file => {
          let file_path = `${this.project_path}/${file}`;
          fs.stat(file_path, (err, stats) => {
            let fileobj: TreeNode & any = {};
            // fileobj.label = path.basename(file_path);
            fileobj.isDirectory = stats.isDirectory;
            (fileobj.isDirectory) ? fileobj.icon = 'fa fa-folder' : fileobj.icon = 'fa fa-file';
            if (fileobj.isDirectory) {
              this.makeFileTree(file_path);
            }

            return files;

          });
        });
      }
    });



  }

}
