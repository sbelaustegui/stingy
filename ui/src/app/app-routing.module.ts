import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {NewUserComponent} from "./new-user/new-user.component";

const routes: Routes =[
  {
    path: '',
    component: AppComponent,
    children: [
      {path: 'login',     component: LoginComponent},
      {path: 'new-user',  component: NewUserComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
