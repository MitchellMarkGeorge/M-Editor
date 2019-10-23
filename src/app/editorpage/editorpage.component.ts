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
import * as os from 'os';

// NOTES
// WILL HAVE 2 SEPERATE MENUS
// might reduce file size




// amke modals stay open until dismissed

// make methods conditional (work based on specific conditons)









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
  last_opend_file = undefined; // variable can be used to access currently opened file/ Filetree object // might rename to current_open_file
  contextMenu: MenuItem[] = [
    {label: 'New File', command: () => { this.newFile() }},
    {label: 'New Folder', command: () => { this.newFolder() }},
    {label: 'Delete', command: () => { this.deleteItem() }},
    {label: 'Refresh FileTree', command: () => { this.refreshFiletree() }},
    //{label: 'Toggle FileTree', command: () => { this.toggleFiletree() }},
    {label: 'Rename', command: () => { this.renameModal() }}, // Works, but need to 'navigate' to new file to work properly and to be effective (Renaming directories work out fine) (rename file when it ois not open)
    {label: 'Generate M-Editor Config File', command: () => { this.generateM_EditorFile() }},
    {label: 'Run Project', command: () => { this.runproject() }},
    {label: 'Open Terminal', command: () => { this.OpenTerminal() }}  //move to MenuBar
    // rename
    // Refresh File tree
    // copy absolute & relative path
    // add files to git
    // commit fles to git
    // install simple-git
    // copy full path
    // copy relative path
    // quickfind 
    // Open project
    // reveal in Filder/ Folder System (is this needed)
    
  ];

  input;
  current_filename: string = 'Welcome! Select a file to begin.';
  language: string;
  runscript;
  selectedFile;
  inital_tree;

  // IMPORTANT !!!!
  // IN ORDER TO RUN PROJECT ON MAC, YOU NEED TO GIVE M-EDITOR ACESS TO YOUR COMPUTER
  //m_editor_cofig_path = path_os.join(this.project_path, 'm-editor.json');






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
    hintOptions: {completeSingle: false},
    //lint: true,
    // gutters: ["CodeMirror-lint-markers"],
    //lineWrapping: true,
    styleActiveLine: true,
    //placeholder: 'Code goes here...',
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

    // will need to change this event
    // might listen to event on only soecific document when swapDoc is called
    this.editor.on("change", (cm, changes) => {
      console.log('content of editor changed')
      // FUTURE AUTOSAVE FEATURE
      // if on in the m-editor.json file, set a timeout for like 4 seconds and then call the save function
      // cant work it ithere is no current document

      if (this.last_opend_file === undefined) {
        return;
      }
      this.last_opend_file.saved = false;
      // shoud i also say if this.last_opend_file.saved is already false, do nothing?? (return;)
      // if it is not saved (it == false)
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
  
  this.resize();







  }



  resize() {

    remote.getCurrentWindow().maximize();

  }

  toggleFiletree() {

    this.filetreeVisible = !this.filetreeVisible;

  }

  buildFileTree(path) {

    

    // might use inital tree and make this.tree an array of that object
    this.tree = new Filetree(path, path_os.basename(path));
    this.tree.build();
    console.log(this.tree)
    this.tree = [this.tree];

    // for(let node of this.tree) {
    //   node.expanded = true;
    // }

    // if (this.input !== undefined) {
    //   let path = path_os.join(this.project_path, this.input);
    //   console.log(this.inital_tree.children.length)

    //   console.log(this.getFileObject(path, [{path: path}]))
    // }

    //console.log(this.tree[0].children)

    console.log(this.tree);
    //console.log(this.tree.flat())

  }

  swapDoc(event) {
   
    // this.editor.setOption('mode', event.node.mode.mode);
    // this.editor.setOption('mode', this.editor.getOption('mode'));
    // fix requiremode
    //this.editor.focus();
    //console.log(event.node);

    //console.log(this.selectedFile);

    // might listen to event on only soecific document when swapDoc is called

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
  // if a file is opend and the file exists (incase of a deleted file)
  if (this.last_opend_file && fs.existsSync(this.last_opend_file.path)){

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
     return; // toast - no file selected or file was deleted
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

  try {
    fs.writeFileSync(path, '') // might turn all file write methods to async
  } catch {

    this.message.add({key: 'save', severity: 'error', summary: `Could not make ${this.input}`, detail: 'Try again.'})

  }
    
      //console.log(err); // create toast unable to make file/ folder
	  //this.message.add({key: 'save', severity: 'error', summary: `Could not make ${this.input}`, detail: 'Try again.'});
    // need to fix this
    
   

    
      
      this.refreshFiletree();
      this.message.add({key: 'save', severity: 'success', summary: `New ${this.input} file made`, detail: 'Reopen filetree to see changes'});
      let file_object = this.getFileObject(this.tree[0], path)
      console.log(file_object);
      console.log(file_object.document);
      // doc is undefined - why
      // figure out why this happens - might change to sync methods
      //   setTimeout (() => {
          

      //     let file_object = this.getFileObject(this.tree[0], path)
      //     console.log(file_object);
      //     this.swapDocFileObject(file_object);
      //     this.selectedFile = file_object;
            
          
          
      //     // if (file_object == null) toast

          
          
        
      // // //   this.input = '';
      //   }, 500) // make async
        this.input = '';

      

      
      //this.selectedFile 
      //this.swapDocFileObject(file_object);

      
      //setTimeout(() => {
      //console.log(this.getFileObject(path, this.inital_tree.children))
       //}, 15000);
      //this.ref.detectChanges();
      //this.message.clear()
      //this.editor.focus();
      //this.gridField.nativeElement.focus();
      
      
    

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

    this.input = '';
	
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
  
  // so the editor is not affected - figure this out
  setTimeout(() => {this.editor.focus();}, 0)
  //this.editor.focus();
}
  
toggleQuickFind(){
  this.quickfind = !this.quickfind;
}

runproject() {
  let m_editor_cofig_path = path_os.join(this.project_path, 'm-editor.json');
  // check for M-Editor config file

  if (!fs.existsSync(m_editor_cofig_path)) {
    //return; // toat alerting there is no m-editor.json file
    console.log('m-editor file does not exists')
  } else {
    fs_extra.readJson(m_editor_cofig_path, (err, object) => {
      if (object) {
        console.log(object);
        console.log(object.runscript);
        this.runscript = object.runscript;
        this.executeRunCommand();

      } else if (err) {
        console.log(err) // err toast - coudnt read m_editor file
      }
    })
  }
  // check if runscript variable has content
  // read file and execute content
  // Decide if i am using an indeditor terminal or opening an new terminal window

}

executeRunCommand() {

  if (!this.runscript) { // check if m-editor.json file exists ????
    return; // toast aleting there is no runscript, try again
  } else {
    if (os.platform() == 'darwin') {
      console.log('MacOS');
      // REMEMBER - cd into project directory befor executing command
      // For mac, write Appscript scriot to do work (look at stack overflow)
      // Change cdm
      // open terminal and execute runscript
      let cdm = [
        `osascript -e 'tell application "Terminal" to activate'`, 
        `-e 'tell application "System Events" to tell process "Terminal" to keystroke "t" using command down'`, 
        `-e 'tell application "Terminal" to do script "cd ${this.project_path} && ${this.runscript}" in selected tab of the front window'`
      ].join(" "); // might look into alternate way to do this
      child_proccess.exec(cdm, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${this.runscript} script is running...`);
        }
      })
    } else if (os.platform() == 'win32') {
      console.log('Windows OS')
      let cdm = `start cmd.exe /K cd ${this.project_path} && ${this.runscript}`;
      child_proccess.exec(cdm, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${this.runscript} script is running...`);
        }
      })
    } else {
      return; // platform is not supported
    }
  }



}

OpenTerminal() {
  if (os.platform() == 'darwin') {
    child_proccess.exec(`open -a Terminal ${this.project_path}`, (err) => {
      if (err) {
        console.log(err); // toast saying proces failed and might need to allow M-Editor to access computer
      }
    })
  } else if (os.platform() == 'win32') {
    child_proccess.exec(`start cmd.exe /K cd ${this.project_path}`, (err) => {
      if (err) {
        console.log(err); // toast - process failed
      }
    })
  }
} 

deleteItem() {

  this.message.add({key: 'remove_comfirm', severity: 'warn',  summary: 'Are you sure you want to delete this?', detail: 'Please comfirm below.'})
// severity: 'warn',
}
// switch from liniear search to binary seach algorithm
// figure out search algorithms
// coud alsodiff old filertree and new one
 // optional callback
 getFileObject (element, file_path){
     if(element.path == file_path){
       console.log('match made');
        
          return element;
          
     }else if (element.children != undefined){
          var i;
          var result = null;
          for(i=0; result == undefined && i < element.children.length; i++){
               result = this.getFileObject(element.children[i], file_path);
          }
          return result;
     }
     return null;
}

  
//   // for (let element of tree) {
//   //   console.log(element, file_path)
//   //   if (file_path == element.path) {
//   //     console.log('match made')
//   //     //console.log(element.children)
//   //     return element;
//   //    } //else if (element.children && element.children.length !== 0) {

//     //   console.log('moving on')
//     //   //console.log(element.path)
//     //   //console.log(element.children)
//     //   return this.getFileObject(file_path, element.children);
//     //  

      
//     //   // console.log('moving on')
//     //   // console.log(element.path)
//     //   // console.log(element.children)
//     //   // this.getFileObject(file_path, element.children);
//     // }
//     //}
    
  



// }

// might add notification saying navigated to new file
swapDocFileObject(object) {

  console.log('tyring to swap doc')

  if (!object.document) {
    console.log('no doc???')
  }
  //console.log(object.saved)

  this.last_opend_file = object;

  for (let key in object) {
    if (key === undefined) {
      console.log(`${key} is undefined`);
    }
  }

  
  this.editor.swapDoc(object.document);
  
  //this.editor.swapDoc(object.document);

  // console.log(object.parent)
  // if (object.parent) {
  //   object.parent.expanded = true;
  // }
  console.log(object.document)
  if (!object.saved) {
      this.current_filename = `${object.label} (Unsaved)`;
    } else{
      this.current_filename = object.label;
    }
    if (object.mode){
      this.language = object.mode.name;
    } else {
      this.language = 'Plain Text' // Language is undefined??? None??? Lang not supported
    }
    
    this.editor.setOption('mode', object.mode.mime);
    this.editor.setOption('mode', this.editor.getOption('mode'));

    // if (object.parent) {
    //   object.parent.expanded = true;
    // }

}

removeItem(object) {

  // might instead move items to the trash so that they can be recovered later if they need to
  this.message.clear();

  try {
    fs_extra.removeSync(object.path);
  } catch (err) {
    console.error(err);
    // error toast
  }

  this.message.add({key: 'save', severity: 'success', summary: `${object.label} has been deleted sucessfully`, detail: 'Check filetree for changes.'});
  this.refreshFiletree();
  this.input = '';
  // would wanto remove current doc and chage lower bar text
  

  this.editor.getDoc().setValue('');

  if (this.last_opend_file.path == object.path) {
  this.current_filename = 'File Deleted. Select another file.'
  this.language = '';
  }
}

closeModal() {
  this.message.clear();
}

renameModal() {
  this.message.add({key: 'rename', severity: 'success', summary: 'Enter what you want to rename item to:', detail: `Renaming: ${this.selectedFile.label}`})
}

renameItem(object) {
  this.message.clear();
  // should check if the use is trying to rename project path
  let new_path = path_os.join(this.project_path, this.input);
  try {
    if (fs.existsSync(new_path)) {
      this.message.add({key: 'save', severity: 'error', summary: ` ${this.input} file already exists in this project`, detail: 'Try another name.'})
      return;
    }
    fs.renameSync(object.path, new_path);
  } catch (err) {
    console.error(err);

    // should not be able to rename to a file that already exists
  }
   console.log('item renamed'); 
   this.message.add({key: 'save', severity: 'success', summary: `${object.label} has been renamed sucessfully`, detail: 'Check filetree for changes.'});
   this.refreshFiletree();

   // shoild be able to tell if it is a file or not
  setTimeout(() => {
    let file_object = this.getFileObject(this.tree[0], new_path);

  console.log(file_object);

  if (!file_object.childeren == undefined) {
    return;
  }

  this.swapDocFileObject(file_object);

  this.selectedFile = file_object;
   
  }, 500)

  this.input = '';
  // NEED TO FIGURE THIS OUT
  
   //this.swapDocFileObject('');

  // NEED to navigate to "new" file 

}

generateM_EditorFile() {
  let m_editor_cofig_path = path_os.join(this.project_path, 'm-editor.json');

  try {
    if (fs.existsSync(m_editor_cofig_path)) {
      return; // show toast saying alredy exists
    }

    fs.writeFileSync(m_editor_cofig_path, '{\n\t"runscript": "the script you want the editor to run to start your project."\n}')
  } catch (err) {
    console.log(err); // error toast
  }

  this.refreshFiletree();
  this.message.add({key: 'save', severity: 'success', summary: `M-Editor Config file made`, detail: 'Reopen filetree to see changes'});
}













}
