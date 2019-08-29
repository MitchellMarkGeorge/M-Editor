import { ElectronService } from './../core/services/electron/electron.service';
import { Component, OnInit, NgZone } from '@angular/core';





import * as os from 'os';
import * as fs from 'fs';

// can i import nodejs modules in like this????
import { Router } from '@angular/router';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  os: any;

  filepath: string;

  constructor(public electron: ElectronService, public router: Router, public zone: NgZone) { }

  ngOnInit() {

    console.log(this.filepath);

    // figure out how to show selescted project filepath


  }

  openFileDialog = () => {

    let dialog = this.electron.remote.dialog;

    dialog.showOpenDialog({title: 'Choose Project', defaultPath: os.homedir(), properties: ['openDirectory', 'showHiddenFiles']},

    (file) => {
      if (file) {
        this.filepath = file[0]; // first element in the array
        this.zone.run(() => { this.router.navigate(['/editor-page'], {queryParams: {path: this.filepath}}); });

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

}
