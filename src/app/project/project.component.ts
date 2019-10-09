import { Component, OnInit, NgZone } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
MessageService


import * as fs from 'fs';
import * as os from 'os';

import * as path from 'path';

// can i import nodejs modules in like this????
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';
import { NodeapiService } from '../nodeapi.service';
import { ThrowStmt } from '@angular/compiler';
import { throwError } from 'rxjs';
NgZone




@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  languages: SelectItem[] = [{label: 'Select Language', value: undefined}, {label: 'Javascript', value: 'Javascript'}, {label: 'Typescript', value: 'Typescript'}, {label: 'Python', value: 'Python'}, {label: 'Java', value: 'Java'}];
  project_name: string = undefined; // " ";
  selected_lang = undefined;
  path: string;




  // resize window when navigating to editor page
  // Explore more options
  // path??

  // path will be os.homedir()/project_name => send path to editor and change current directory to that (after creating it).

  // only pass path as query param


  constructor(public router: Router, public electron: ElectronService, public nodeservice: NodeapiService, public zone: NgZone, public message: MessageService) { }

  ngOnInit() {

  }

  gotoEditor() {


    // if they are still undefined
    // might just use acess (so i dont try and acees a file/folder im not meant to)

    //console.log(this.selected_lang);
    if (this.selected_lang === undefined || this.project_name === undefined) {

        
        console.log('ok');

        this.message.add({severity: 'error', summary: 'New Project field is empty', detail: "Please try again."});
        // use toasts

        
        // so it dosent do anything
    } else {

    //this.path = `${os.homedir()}/${this.project_name}`;//  USE path.join()
    this.path = path.join(os.homedir(), this.project_name);
    //this.path = `${process.env.HOME}/${this.project_name}`
    console.log(this.path);

    if(fs.existsSync(this.path)) {
      this.message.add({severity: 'error', summary: 'Project Already Exists', detail: "Try another name"})
    } else {
      this.createfiles()
      //this.navigate()
      

      // navigates to quickly and dosent read directory properly
      // need to fix
      setTimeout(() => {
        this.navigate();
      }, 0)

      
        //this.navigate();
      

      //this.zone.run(() => {this.navigate()})
      //this.navigate();
    }



  }

}

navigate() {

  this.router.navigate(['/editor-page'], {queryParams: {path: this.path}});

}

    // MIGHT WANT TO USE TRY/CATCH BLOCK

  //   if (fs.existsSync(this.path)) {
  //     // alert('Project already exists. Try another project name');
  //     this.showErrorDialog('Project of same name already exists', 'Please try again.');
  //     return; // do nothing
  //     // for alters, show error dialogs
  //   } else {

  //   console.log(this.path);
  //   console.log(this.selected_lang);






  //   }

  //   //console.log(path.join(os.homedir(), this.project_name));
  //   // HAVE A PATH FIELS

  //   }






  //    // this.router.navigate(['/editor-page']);
  // }


   showErrorDialog(title: string, message: string) {
     const dialog = this.electron.remote.dialog;
     dialog.showErrorBox(title, message);
   }


  createfiles() {

    fs.mkdir(this.path, (err) => {

      if (err) {
        this.showErrorDialog('Unable to make Project directory', 'Please try again');
      } else {

        if (this.selected_lang === 'Javascript') {
        //fs.openSync(path.resolve(this.path, 'index.js'), 'w');
        //console.log('Javascript')

        fs.writeFileSync(path.resolve(this.path, 'index.js'), 'console.log("Start Programming!")');

        // fs.writeFile(path.resolve(this.path, 'index.js'), 'console.log("Start Programming!")', (err) => {
        //   if (err){
        //     console.log(err)
        //   } else {
        //     console.log('file done');
        //   }
        // } )

        // npm init

       } else  if (this.selected_lang === 'Typescript') {
         fs.writeFileSync(path.resolve(this.path, 'index.ts'), 'console.log("Start Programming!")');
         // npm init -y
         // tsc init
         // npm install --save-dev typescript ??

       } else if (this.selected_lang === 'Java') {
         fs.writeFileSync(path.resolve(this.path, 'Hello.java'), 'public class Hello {} ');

       } else if (this.selected_lang === 'Python') {
         fs.writeFileSync(path.resolve(this.path, 'hello.py'), 'print("Start Programming")');

       } 

      }

     });

     // fix file not found error


      // might use async version
    // in that dir, make a file based on the selected language
   }




}


