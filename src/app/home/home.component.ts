import { NodeapiService } from './../nodeapi.service';
import { ElectronService } from './../core/services/electron/electron.service';
import { Component, OnInit, NgZone } from '@angular/core';






import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { remote } from 'electron';

// can i import nodejs modules in like this????
import { Router } from '@angular/router';
import Filetree from '../filetree';







@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  os: any;

  filepath: string;
  blocked;
  message;
  constructor(public electron: ElectronService, public router: Router, public zone: NgZone, public nodeservice: NodeapiService ) { }

  ngOnInit() {

    // let Menu = remote.Menu;
    
    
    

    // let template = [
    //   {label: 'Editor', submenu: [
    //     {label: 'Test'}
    //   ]}, 

    //   {label: 'Why', submenu: [
    //     {label: 'hello'}
    //   ]}
    // ]

    // let menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu);


    //console.log(this.filepath);

    // figure out how to show selescted project filepath


  }

  openFileDialog = () => {

    let dialog = remote.dialog;

    

    dialog.showOpenDialog({title: 'Choose Project', defaultPath: os.homedir(), properties: ['openDirectory', 'showHiddenFiles']},

    (file) => {
      if (file) {

        this.filepath = file[0]; // first element in the array

         this.zone.run(() => { this.navigate() });
         console.log(this.filepath);

        // needed to navigate properly - nead to read up about zones in Angular
        console.log({file});



      }  // else if (canceled == true) return; // do nothing
    });
  }

  gotoEditorPage() {
    if (this.filepath === null || this.filepath === undefined) {
      this.showErrorDialog('You have not picked a project to open in the editor', 'Try again.');
      return; // do nothing
    }

    // work on openg projects


  }

  showErrorDialog(title: string, message: string) {
    const dialog = this.electron.remote.dialog;
    dialog.showErrorBox(title, message);
  }

  navigate() {
    this.router.navigate(['/editor-page'], {queryParams: {path: this.filepath}});
  }

  // final_navigation() {
  //   this.nodeservice.createtree(this.filepath).then(() =>
  //   {
  //      this.navigate(); });
  // }

}
