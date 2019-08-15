import { Component, OnInit } from '@angular/core';
import {SelectItem} from 'primeng/api';


import * as fs from 'fs';
import * as os from 'os';

// can i import nodejs modules in like this????
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  languages: SelectItem[] = [{label: 'Select Language', value: null}, {label: 'Javascript', value: 'Javascript'}, {label: 'Typescript', value: 'Typescript'}, {label: 'Python', value: 'Python'}, {label: 'Java', value: 'Java'}, {label: 'C++', value: 'C++'}, {label: 'C#', value: 'C#'}];
  project_name: string = undefined; // " ";
  selected_lang: SelectItem = undefined;
  path: string;




  // resize window when navigating to editor page
  // Explore more options
  // path??

  // path will be os.homedir()/project_name => send path to editor and change current directory to that (after creating it).

  // only pass path as query param


  constructor(public router: Router, public electron: ElectronService) { }

  ngOnInit() {

  }

  gotoEditor() {
    // if they are still undefined

    console.log(this.selected_lang);
    if (this.selected_lang === undefined || this.project_name === undefined) {
        // alert('New Project fields are not filled');
        // test this condition




        this.showErrorDialog('New Project filed are empty', 'Please try again.');


        return;
        // so it dosent do anything
    }

    this.path = `${os.homedir}/${this.project_name}`;



    if (fs.existsSync(this.path)) {
      // alert('Project already exists. Try another project name');
      this.showErrorDialog('Project of same name already exists', 'Please try again.');

      // for alters, show error dialogs
    }

    console.log(this.path);
    console.log(this.selected_lang);


     fs.mkdir(this.path, (err) => {

      if (err) {
        this.showErrorDialog('Unable to make Project directory', 'Please try again');
      }

     });

     if (this.selected_lang.label === 'Javascript') fs.writeFileSync(`${this.path}/index.js`, 'Start Programming!');
      // might use async version
    // in that dir, make a file based on the selected language




     // navigate to editor with path param

     this.router.navigate(['/editor-page'], {queryParams: {path: this.path}});
  }

  showErrorDialog(title: string, message: string) {
    const dialog = this.electron.remote.dialog;
    dialog.showErrorBox(title, message);
  }


}
