import { TreeNode } from 'primeng/api';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

import * as process from 'process';


import { remote } from 'electron';

import * as codemirror from 'codemirror';
import { Tree } from 'primeng/tree';

import * as dirtree from 'directory-tree';
import { NodeapiService } from '../nodeapi.service';
import {MessageService} from 'primeng/api';








@Component({
  selector: 'app-editorpage',
  templateUrl: './editorpage.component.html',
  styleUrls: ['./editorpage.component.scss']
})
export class EditorpageComponent implements OnInit {
  //project_map: any;
  project_path;
  final_tree: any;
  filetreeVisible: boolean = false;
  tree = undefined;
  editor;
  last_opend_file;



  constructor( public nodeservice: NodeapiService, public message: MessageService, public router: Router ) { }

  ngOnInit() {

    // resize window
    this.resize();


    // this.route.queryParamMap.subscribe( param => {
    //   this.project_map = param;
    // });

    // console.log(this.project_path);

    // this.project_path = this.project_map.params.path;

    // console.table(this.project_path);





    // console.log(this.tree);

    this.tree = [this.nodeservice.returntree()];

    console.log(this.tree);









    // need to show what file you are on



    codemirror.commands.autocomplete = function(cm) {
      cm.showHint({hint: codemirror.hint.anyword});
    };

    codemirror.commands.save = () => {
      this.saveFile();
    }



    let options = {
    lineNumbers: true,
    //theme: 'one-dark',
    //theme: 'material-darker',
    theme: 'darcula',
    // figure out theme
    //mode: 'javascript',

    autocorrect: true,
    spellcheck: true,
    matchBrackets: true,
    matchTags: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    showMatchesOnScrollbar: true,
    smartIndent: true,
    indentWithTabs: true,
    //lineWrapping: true,
    styleActiveLine: true,
    placeholder: 'Code goes here...',
    keyMap: 'sublime',
    extraKeys: {"Ctrl-Space": "autocomplete" , ".": (cm) => {
      setTimeout(() => {
        cm.execCommand("autocomplete")
      }, 100); throw new Error('Neep this error to show to work'); // might also use codemirror.Pass to throw error
    }} // autocomplete!!!


  };

    this.editor = codemirror(document.getElementById('editor'), options);
    this.editor.focus();
    // this.editor.on('keyup', (cm) => {
    //   cm.execCommand('autocomplete');

    // })

    // let editor = codemirror.fromTextArea(document.getElementById('area'), options);

    // uninstall @types/codemirror







    // this.final_tree = dirtree(this.project_path);
    // this.final_tree.label = this.final_tree.name.name;
    // this.final_tree.icon = 'fa fa-folder';

    //let arr = {data: [this.final_tree]};

    // console.log(this.final_tree);

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



  resize() {

    remote.getCurrentWindow().maximize();

  }

  toggleFiletree() {

    this.filetreeVisible = !this.filetreeVisible;

  }

  async getDirTree() {

    // error here  - figure out why

    this.final_tree = dirtree(this.project_path);

    console.log(this.final_tree);

  }

  swapDoc(event) {
    // this.editor.setOption('mode', event.node.mode.mode);
    // this.editor.setOption('mode', this.editor.getOption('mode'));
    // fix requiremode
    this.last_opend_file = event.node;
    this.editor.swapDoc(event.node.document);
    this.editor.setOption('mode', event.node.mode.mime);
    this.editor.setOption('mode', this.editor.getOption('mode'));




    // setTimeout(() => {
    //   this.editor.setOption('mode', event.node.mode.mode);
    // this.editor.setOption('mode', this.editor.getOption('mode'));
    // }, 0);
    // errorhandling???
    // if undefied, make mode plain text
    console.log(event.node.document);
    console.log(event.node);
    //codemirror.autoLoadMode(this.editor, event.node.mode);
    console.log(event.node.mode);
    // app.component.css files dont load
    // set editor mode
    // SYNTAX HIGHLIGHTING
    //  codemirror.requireMode(event.node.mode, () => {
    //    console.log("done! mode loaded");
    //  });
    // should i just support specific languages?????
    //codemirror.modeURL = "node_modules/codemirror/mode/%N/%N.js"


    //this.editor.refresh();
    // codemirror.modeURL = "./node_modules/codemirror/mode/%N/%N.js"
    // codemirror.autoLoadMode(this.editor, event.node.mode.mode);
    // have to tap twice to get syntax highligting ot work
    console.log(`mode set to ${event.node.mode.mime}`);
    //codemirror.autoLoadMode(this.editor, event.node.mode.mode);

    // this.editor.setOption('value', event.node.document);
    // console.log(event.node);
    // i can also set the value;
  }


 saveFile() {

  let text = this.editor.getDoc().getValue();
  console.log("have value")
  console.log(this.last_opend_file);
  fs.writeFile(this.last_opend_file.path, text, (err) => {
  if (err) {
    console.error(err);
  }

   console.log("written to file");
   this.successfullFileSave(this.last_opend_file.label);
   this.last_opend_file.document.clearHistory();
  });

   // TODO save file
   // - get curent codument
   // - get curent value of that document
   // - write the contenet of that doc to the corresponding file with a onditon (figure this out (if it is a string))
   // - show toast saying file has been saved
 }

 successfullFileSave(filename) {
  this.message.add({severity: 'success', summary:'File Saved', detail: `${filename} saved`});
 }

 gotoNewProjectPage() {
   this.router.navigate(['/new-project']);

 }

 gotoHomePage() {
  this.router.navigate(['/']);

}







}
