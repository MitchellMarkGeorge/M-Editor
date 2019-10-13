import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as codemirror from 'codemirror';
import { remote } from 'electron';
import * as fs from 'fs';
import * as path_os from 'path';
import * as child_proccess from 'child_process';
import { MenuItem, MessageService } from 'primeng/api';
import Filetree from '../filetree';
import { NodeapiService } from '../nodeapi.service';
import * as fs_extra from 'fs-extra';

// NOTES
// WILL HAVE 2 SEPERATE MENUS














// should the editor be able to save multiple files at once? (create an array of open files)








@Component({
  selector: 'app-editorpage',
  templateUrl: './editorpage.component.html',
  styleUrls: ['./editorpage.component.scss']
})
export class EditorpageComponent implements OnInit {
  quickfind: boolean = false;
  project_map: any;
  project_path;
  final_tree: any;
  filetreeVisible: boolean = true;
  tree = undefined;
  editor;
  last_opend_file; // variable can be used to access currently opened file/ Filetree object // might rename to current_open_file
  contextMenu: MenuItem[] = [
    {label: 'New File', command: () => { this.newFile() }},
    {label: 'New Folder', command: () => { this.newFolder() }},
    {label: 'Delete', command: () => { this.deleteItem() }}
    
  ];

  input;
  current_filename: string = 'Welcome';
  language: string;
  runscript;
  selectedFile;






  constructor( public nodeservice: NodeapiService, public message: MessageService, public router: Router, public route: ActivatedRoute, public ref: ChangeDetectorRef ) { }

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

    // resize window
    this.resize();

     


    this.route.queryParams.subscribe( param => {
      this.project_path = param.path;
    });

    console.log(typeof this.project_path);

    //console.log(this.project_map);

    //this.project_path = this.project_map.params.path;

    this.buildFileTree(this.project_path);

    // let last_slash = this.project_path.lastIndexOf('/');

    // if (last_slash !== -1){
    //   this.project_name = this.project_path.slice(last_slash);
    // }

    

    // console.table(this.project_path);





    // console.log(this.tree);

    // this.tree = [this.nodeservice.returntree()];

    // console.log(this.tree);









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
    //theme: 'darcula',
    theme: 'custom-theme',
    // FIGURE OUT THEME
    //FINISH CONTEXT MENU
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
    lint: true,
    // gutters: ["CodeMirror-lint-markers"],
    //lineWrapping: true,
    styleActiveLine: true,
    placeholder: 'Code goes here...',
    keyMap: 'sublime',
    extraKeys: {"Ctrl-Space": "autocomplete" , ".": (cm) => {
      setTimeout(() => {
        cm.execCommand("autocomplete")
      }, 100); throw new Error('Need this error to show to work'); // might also use codemirror.Pass to throw error
    }, "Ctrl-P": () => {this.toggleQuickFind()}} // autocomplete!!!
	  
	  // quickfind - "Ctrl-P": () => {this.toggleQuickFind()}
    // [filter]="true"

  };

    this.editor = codemirror(document.getElementById('editor'), options);
    //this.editor.focus();

    // Editor events to listen to
    this.editor.on("change", (cm, changes) => {
      console.log('content of editor changed')
      this.last_opend_file.saved = false;
      // shoud i also say if this.last_opend_file.saved is already false, do nothing?? (return;)
      // if it is not saved
      if (!this.last_opend_file.saved) {
        this.current_filename = `${this.last_opend_file.label} (Unsaved)`;
      }
      //this.ref.markForCheck();
    })

    // this.editor.on("inputRead", (cm, changes) => {
    //   console.log('input read');
    // })
   

    // let editor = codemirror.fromTextArea(document.getElementById('area'), options);

    







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

    
	
	// show message before app is closed completely
	
	// let mainWindow = remote.getCurrentWindow();
	
	// mainWindow.on('close', () => {
	//   let dialog = remote.dialog;
	//   dialog.showMessageBox({
  //           message: "Are you sure you want to quit M-Editor? There may be some unsaved files.",
  //           buttons: ["Close"]
  //       });
	  
	// })







  }



  resize() {

    remote.getCurrentWindow().maximize();

  }

  toggleFiletree() {

    this.filetreeVisible = !this.filetreeVisible;

  }

  buildFileTree(path) {

    

    
    this.tree = new Filetree(path, path_os.basename(path));
    this.tree.build();
    this.tree = [this.tree];

    console.log(this.tree)

  }

  swapDoc(event) {
    // this.editor.setOption('mode', event.node.mode.mode);
    // this.editor.setOption('mode', this.editor.getOption('mode'));
    // fix requiremode
    //this.editor.focus();
    //console.log(event.node);
    this.last_opend_file = event.node;
    this.editor.swapDoc(event.node.document);
    if (!event.node.saved) {
      this.current_filename = `${event.node.label} (Unsaved)`;
    } else{
      this.current_filename = event.node.label;
    }
    if (event.node.mode){
      this.language = event.node.mode.name;
    } else {
      this.language = 'Plain Text' // Language is undefined??? None??? Lang not supported
    }
    
    this.editor.setOption('mode', event.node.mode.mime);
    this.editor.setOption('mode', this.editor.getOption('mode'));
    
    
    //this.ref.markForCheck()
	  
	
	// should it focus?




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
  // if a file is opend
  if (this.last_opend_file){

  let text = this.editor.getDoc().getValue();
  console.log("have value")
  //console.log(this.last_opend_file);
  fs.writeFile(this.last_opend_file.path, text, (err) => {
  if (err) {
    this.message.add({key: 'save', severity: 'error', summary: 'Unable to save file', detail: 'Try again.'});
  }

   this.last_opend_file.saved = true;

  // if the string ends with the unsaved flag, remove it as the file has now been saved
   if (this.current_filename.endsWith('(Unsaved)')) {
     this.current_filename = this.current_filename.replace('(Unsaved)', '');
   }
   console.log("written to file");
   this.successfullFileSaveToast(this.last_opend_file.label);
   this.last_opend_file.document.clearHistory();
  });
  } else {
     return;
  }

   
   // need to show if a file is saved

   // TODO save file
   // - get curent codument
   // - get curent value of that document
   // - write the contenet of that doc to the corresponding file with a onditon (figure this out (if it is a string))
   // - show toast saying file has been saved
 }

 successfullFileSaveToast(filename) {
  this.message.add({key: 'save', severity: 'success', summary:'File Saved', detail: `${filename} saved`});
 }



 gotoHomePage() {
  this.router.navigate(['/']);

}

newFile(){
  this.message.add({key: 'new_file', sticky: true, severity: 'success', summary:'New File', detail: 'Enter path for new file here:'})
}

newFolder() {
  this.message.add({key: 'new_folder', sticky: true, severity: 'success', summary:'New Folder', detail: 'Enter path for new folder:'})

}

createnewFile(){

  
  this.message.clear()
  
  let path = path_os.resolve(this.project_path, this.input);

  if (fs.existsSync(path)){
    this.message.add({key: 'save', severity: 'error', summary: ` ${this.input} file already exists in this project`, detail: 'Try another name.'})
    return;
  }

  fs.writeFile(path, 'Start Programming', (err) => {
    if (err){
      //console.log(err); // create toast unable to make file/ folder
	  this.message.add({key: 'save', severity: 'error', summary: `Could not make ${this.input}`, detail: 'Try again.'});
    // need to fix this
    
    } else {

    
      
      this.refreshFiletree();
	    this.message.add({key: 'save', severity: 'success', summary: `New ${this.input} file made`, detail: 'Reopen filetree to see changes'});
      //this.ref.detectChanges();
      //this.message.clear()
      //this.editor.focus();
      //this.gridField.nativeElement.focus();
      
      
    }
  })
}
  
createnewFolder(){
  this.message.clear();
  this.editor.focus();
  let path = path_os.resolve(this.project_path, this.input);
  fs.mkdir(path, (err) => {
	if (err) {
	  console.log(err);
	  this.message.add({key: 'save', severity: 'error', summary: `Could not make ${this.input}`, detail: 'Try again.'});
	} else {
	  
	  this.refreshFiletree()
	  this.message.add({key: 'save', severity: 'success', summary: `New ${this.input} folder made`, detail: 'Reopen filetree to see changes'});
    // might not need this message
    //this.editor.focus();
	
	}
	
  });
}
  
refreshFiletree(){

  this.buildFileTree(this.project_path);
  this.ref.markForCheck();
  
  for(let node of this.tree) {
	node.expanded = true;
  } // so the file tree dosent dosent 'close' (even though it does)
	// can olo acess through index or array destructuring
  this.editor.focus();
}
  
toggleQuickFind(){
  this.quickfind = !this.quickfind;
}

runproject() {

}

deleteItem() {

  this.message.add({key: 'remove_comfirm', severity: 'warn',  summary: 'Are you sure you wan to delete this?', detail: 'Please comfirm below.'})
// severity: 'warn',
}





// might try to restrict to tree







}
