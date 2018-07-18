import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminAuthService} from "../../shared/auth/admin/admin-auth.service";
import {Router} from "@angular/router";
import {LoginUser} from "../../shared/models/login-user.model";


declare var require: any;

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AdminLoginComponent implements OnInit {


  public formGroup: FormGroup;
  public loginUser: LoginUser; //TODO CHANGE TO LOGINADMINUSER
  public loginUserError: boolean;
  public loginLoading: boolean;
  public imgSource = require('../../../assets/img/stingy-logo2.png');

  constructor(public formBuilder: FormBuilder, public adminAuthService: AdminAuthService, public router: Router) {}

  ngOnInit() {
    this.loginUser = LoginUser.empty();
    this.formGroup = this.createFormGroup();
    this.loginUserError = false;
    this.loginLoading = false;
  }

  login() {
    this.loginLoading = true;
    this.adminAuthService.login(this.loginUser).then(() => {
      this.loginUserError = false;
      this.loginLoading = false;
      window.location.reload();
      // this.router.navigate(['admin', 'admin-user', 'categories']);
    }).catch(() => {
      this.loginUserError = true;
      this.loginLoading = false;
    });
  }

  private createFormGroup() {
    return this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
      }
    );
  }


}
