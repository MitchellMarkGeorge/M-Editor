
// import 'reflect-metadata';
// import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreModule } from './core/core.module';

// figure this out


import { AppRoutingModule } from './app-routing.module';





import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { ProjectComponent } from './project/project.component';
import { EditorpageComponent } from './editorpage/editorpage.component';

import {TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';





@NgModule({
  declarations: [AppComponent, HomeComponent, ProjectComponent, EditorpageComponent],
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
