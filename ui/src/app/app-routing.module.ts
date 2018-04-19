import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {NewUserComponent} from "./new-user/new-user.component";
import {ReverseUserAuthGuard} from "./shared/auth/user/reverse-user-auth-guard.service";
import {UserAuthGuard} from "./shared/auth/user/user-auth-guard.service";
import {HomeComponent} from "./user/home/home.component";
import {UserComponent} from "./user/user.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminLoginComponent} from "./admin/login/login.component";
import {ReverseAdminAuthGuard} from "./shared/auth/admin/reverse-admin-auth-guard.service";
import {AdminAuthGuard} from "./shared/auth/admin/admin-auth-guard.service";
import {AdminHomeComponent} from "./admin/home/home.component";
import {ProfileComponent} from "./user/profile/profile.component";

const routes: Routes =[
  {
    path: '',                                                         component: AppComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', canActivate: [ReverseUserAuthGuard],            component: LoginComponent},
      {path: 'new-user',                                              component: NewUserComponent},
      {path: 'user', canActivate: [UserAuthGuard],                    component: UserComponent,
        children: [
          {path: 'home',                                              component: HomeComponent},
          {path: 'profile',                                           component: ProfileComponent},
        ]
      },
      {path: 'admin',                                                 component: AdminComponent,
        children: [
          {path: 'login',      component: AdminLoginComponent},
          // {path: 'login',  canActivate: [ReverseAdminAuthGuard],      component: AdminLoginComponent},
          {path: 'home',             component: AdminHomeComponent},
          // {path: 'home',  canActivate:  [AdminAuthGuard],             component: AdminHomeComponent},
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
    UserAuthGuard,
    ReverseAdminAuthGuard,
    AdminAuthGuard
  ]
})
export class AppRoutingModule { }
