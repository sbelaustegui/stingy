import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {NewUserComponent} from "./new-user/new-user.component";
import {ReverseUserAuthGuard} from "./shared/auth/user/reverse-user-auth-guard.service";
import {UserAuthGuard} from "./shared/auth/user/user-auth-guard.service";
import {HomeComponent} from "./user/home/home.component";
import {UserComponent} from "./user/user.component";

const routes: Routes =[
  {
    path: '',
    component: AppComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', canActivate: [ReverseUserAuthGuard], component: LoginComponent},
      {path: 'new-user',  component: NewUserComponent},
      {path: 'user', component: UserComponent, canActivate: [UserAuthGuard],
        children: [
          {path: 'home', component: HomeComponent},
        ]
      }
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
  providers : [
    ReverseUserAuthGuard,
    UserAuthGuard
  ]
})
export class AppRoutingModule { }
