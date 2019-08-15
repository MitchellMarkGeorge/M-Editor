import { TreeNode } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';


import { remote } from 'electron';

import * as monaco from 'monaco-editor';



@Component({
  selector: 'app-editorpage',
  templateUrl: './editorpage.component.html',
  styleUrls: ['./editorpage.component.scss']
})
export class EditorpageComponent implements OnInit {
  project_map: any;
  project_path;
  final_tree: any;

  constructor(public route: ActivatedRoute) { }

  ngOnInit() {

    // resize window
    this.resize();

    this.route.queryParamMap.subscribe( param => {
      this.project_map = param;
    });

    this.project_path = this.project_map.params.path;

    console.table(this.project_path);


    // monaco editor

    // monaco.editor.create(document.getElementById('editor'), {
    //   // test config
    //   language: 'javascript',
    //   theme: 'vs'
    // });
  }

  resize() {

    remote.getCurrentWindow().maximize();

  }

}
