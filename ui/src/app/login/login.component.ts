import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserAuthService} from "../shared/auth/user/user-auth.service";
import {Router} from "@angular/router";
import {LoginUser} from "../shared/models/login-user.model";

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
  public imgSource = require('../../assets/img/stingy-Icon.png');

  constructor(public formBuilder: FormBuilder, public authUserService: UserAuthService, public router: Router) {}

  ngOnInit() {
    this.loginUser = LoginUser.empty();
    this.formGroup = this.createFormGroup();
    this.loginUserError = false;
  }

  login() {
    this.authUserService.login(this.loginUser).then(() => {
      this.loginUserError = false;
      this.router.navigate(['user', 'home'])
    }).catch(() => this.loginUserError = true);
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
