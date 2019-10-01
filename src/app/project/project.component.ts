import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';


import * as fs from 'fs';
import * as os from 'os';

import * as path from 'path';

// can i import nodejs modules in like this????
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';
import { NodeapiService } from '../nodeapi.service';




@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  languages: SelectItem[] = [{label: 'Select Language', value: null}, {label: 'Javascript', value: 'Javascript'}, {label: 'Typescript', value: 'Typescript'}, {label: 'Python', value: 'Python'}, {label: 'Java', value: 'Java'}, {label: 'C++', value: 'C++'}, {label: 'C#', value: 'C#'}];
  project_name: string = undefined; // " ";
  selected_lang = undefined;
  path: string;




  // resize window when navigating to editor page
  // Explore more options
  // path??

  // path will be os.homedir()/project_name => send path to editor and change current directory to that (after creating it).

  // only pass path as query param


  constructor(public router: Router, public electron: ElectronService, public nodeservice: NodeapiService) { }

  ngOnInit() {

  }

  gotoEditor() {
    // if they are still undefined

    console.log(this.selected_lang);
    if (this.selected_lang === undefined || this.project_name === undefined) {

        this.showErrorDialog('New Project field is empty', 'Please try again.');


        return;
        // so it dosent do anything
    }

    this.path = `${os.homedir()}/${this.project_name}`;//  USE path.join()
    //console.log(path.join(os.homedir(), this.project_name));
    // HAVE A PATH FIELS



    if (fs.existsSync(this.path)) {
      // alert('Project already exists. Try another project name');
      this.showErrorDialog('Project of same name already exists', 'Please try again.');
      return; // do nothing
      // for alters, show error dialogs
    }

    console.log(this.path);
    console.log(this.selected_lang);


    this.createfiles();




     // navigate to editor with path param
    // FIX NAVIGATION
     // this.nodeservice.createFileTree(this.path).then(() => { this.router.navigate(['/editor-page']); });
    this.nodeservice.createtree(this.path).then(() => { this.router.navigate(['/editor-page']); });
     // this.router.navigate(['/editor-page']);
  }

  showErrorDialog(title: string, message: string) {
    const dialog = this.electron.remote.dialog;
    dialog.showErrorBox(title, message);
  }


  createfiles() {
    fs.mkdir(this.path, (err) => {

      if (err) {
        this.showErrorDialog('Unable to make Project directory', 'Please try again');
      }

     });

     // fix file not found error

     if (this.selected_lang === 'Javascript') {
       fs.writeFileSync(path.resolve(this.path, 'index.js'), 'console.log("Start Programming!")');
       // npm init

      } if (this.selected_lang === 'Typescript') {
        fs.writeFileSync(path.resolve(this.path, 'index.ts'), 'console.log("Start Programming!")');
        // npm init -y
        // tsc init
        // npm install --save-dev typescript ??

      } if (this.selected_lang === 'Java') {
        fs.writeFileSync(path.resolve(this.path, 'Hello.java'), 'public class Hello {} ');

      } if (this.selected_lang === 'Python') {
        fs.writeFileSync(path.resolve(this.path, 'hello.py'), 'print("Start Programming")');

      } if (this.selected_lang === 'C++') {
        fs.writeFileSync(path.resolve(this.path, 'Hello.cpp'), 'int hello = "hello world"');

      } if (this.selected_lang === 'C#') {
        fs.writeFileSync(path.resolve(this.path, 'Hello.cs'), 'int hello = "hello world"');
      }
      // might use async version
    // in that dir, make a file based on the selected language
  }


}
