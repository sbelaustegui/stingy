import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/user.model";
import {Router} from "@angular/router";
import {AdminAuthService} from "../../shared/auth/admin/admin-auth.service";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {MatSnackBar} from "@angular/material";

declare var require: any;
@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {


  public imgSource = require('../../../assets/stingy-icon.svg');
  public user: User;
  public isCollapsed: boolean;

  constructor(public authService: AdminAuthService, public router: Router, public userAuthService: UserAuthService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isCollapsed = true;
    this.user = User.empty();
    this.getUser();
  }

  getUser(){
    this.authService.loggedUser.then(res => {
      this.user = res;
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener los datos del usuario loggeado, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    })
  }

  logout(){
    if(this.authService.isLoggedIn) {
      this.authService.logout().then(() => {
        this.router.navigate(['admin', 'login']);
      }).catch(() => {
        this.snackBar.open('Hubo un error desloggearte, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    }
    if(this.userAuthService.isLoggedIn) {
      this.authService.logout().then(() => {
        this.router.navigate(['login']);
      }).catch(() => {
        this.snackBar.open('Hubo un error desloggearte, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    }
  }

}
