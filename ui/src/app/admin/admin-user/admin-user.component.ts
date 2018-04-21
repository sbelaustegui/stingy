import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/models/user.model";
import {Router} from "@angular/router";
import {AdminAuthService} from "../../shared/auth/admin/admin-auth.service";

declare var require: any;
@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {


  public imgSource = require('../../../assets/stingy-icon.svg');
  public user: User;

  constructor(public authService: AdminAuthService, public router: Router) { }

  ngOnInit() {
    this.user = User.empty();
    this.getUser();
  }

  getUser(){
    this.authService.loggedUser.then(res => {
      this.user = res;
    })
  }

  logout(){
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    })
  }

}
