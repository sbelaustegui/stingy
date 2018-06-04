import { Component, OnInit } from '@angular/core';
import {UserAuthService} from "../shared/auth/user/user-auth.service";
import {Router} from "@angular/router";
import {User} from "../shared/models/user.model";

declare var require: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public imgSource = require('../../assets/stingy-icon.svg');
  public user: User;
  public isCollapsed: boolean;

  constructor(public authService: UserAuthService, public router: Router) { }

  ngOnInit() {
    this.isCollapsed = true;
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

  // goToProfile(){
  //   this.router.navigate(['user', 'profile'])
  // }

}
