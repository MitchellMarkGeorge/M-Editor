import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

// FEATURES
// import 'codemirror/addon/mode/loadmode.js';
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/mode/meta.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/keymap/sublime.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/lint/json-lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/display/autorefresh.js'




// LANGS/ MODES
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/dart/dart.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/sass/sass.js';
import 'codemirror/mode/handlebars/handlebars.js';
import 'codemirror//mode/swift/swift.js';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/php/php.js';


// TODO fix require mode fuction in filetree.ts




//import 'codemirror/addon'; // ???
// import 'node_modules/codemirror/lib/codemirror.js';



if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .catch(err => console.error(err));
