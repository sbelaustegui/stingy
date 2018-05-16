import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserAuthService} from "../shared/auth/user/user-auth.service";
import {Router} from "@angular/router";
import {LoginUser} from "../shared/models/login-user.model";
import {Title} from "@angular/platform-browser";

declare var require: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserAuthService]
})
export class LoginComponent implements OnInit {

  public formGroup: FormGroup;
  public loginUser: LoginUser;
  public loginUserError: boolean;
  public loginLoading: boolean;
  public imgSource = require('../../assets/img/stingy-logo2.png');

  constructor(public formBuilder: FormBuilder, public authUserService: UserAuthService, public router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Login | Stingy');
    this.loginUser = LoginUser.empty();
    this.formGroup = this.createFormGroup();
    this.loginUserError = false;
    this.loginLoading = false;
  }

  login() {
    this.loginLoading = true;
    this.authUserService.login(this.loginUser).then(() => {
      window.location.reload();
      this.loginUserError = false;
    }).catch(() => {
      this.loginUserError = true;
      this.loginLoading = false;
    });
  }
  goRegister(){
    this.router.navigate(['new-user']);
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
