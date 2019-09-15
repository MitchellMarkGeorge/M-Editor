import { NodeapiService } from './../nodeapi.service';
import { ElectronService } from './../core/services/electron/electron.service';
import { Component, OnInit, NgZone } from '@angular/core';






import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

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

    //console.log(this.filepath);

    // figure out how to show selescted project filepath


  }

  openFileDialog = () => {

    let dialog = this.electron.remote.dialog;

    dialog.showOpenDialog({title: 'Choose Project', defaultPath: os.homedir(), properties: ['openDirectory', 'showHiddenFiles']},

    (file) => {
      if (file) {

        this.filepath = file[0]; // first element in the array
        // this.blocked = true;
        // this.message = true;

        // let tree = new Filetree(this.filepath, path.basename(this.filepath));

        // tree.build();


        //console.log(tree);

        // fs.readdir(this.filepath, (err, files) => { if (files) {console.log(files); } });

        // console.log(test);

         this.zone.run(() => { this.final_navigation(); });

        // needed to navigate properly - nead to read up about zones in Angular
        console.log({file});



      }
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
    this.router.navigate(['/editor-page']);
  }

  final_navigation() {
    this.nodeservice.createtree(this.filepath).then(() =>
    {

       this.blocked = false;
       this.navigate(); });
  }

}
