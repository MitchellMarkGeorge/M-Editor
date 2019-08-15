import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project/project.component';
import { EditorpageComponent } from './editorpage/editorpage.component';






const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'new-project',
    component: ProjectComponent
  },

  {
    path: 'editor-page',
    component: EditorpageComponent
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
