import { Component, OnInit } from '@angular/core';
import {UserAuthService} from "../shared/auth/user/user-auth.service";
import {Router} from "@angular/router";

declare var require: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public imgSource = require('../../assets/stingy-icon.svg');

  constructor(public authService: UserAuthService, public router: Router) { }

  ngOnInit() {
  }

  logout(){
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    })
  }

}
