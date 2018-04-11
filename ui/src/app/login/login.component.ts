import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {UserAuthService} from "../shared/auth/user/user-auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserAuthService]
})
export class LoginComponent implements OnInit {

  public formGroup: FormGroup;
  public loginUser;
  public loginUserError: boolean;


  constructor(public formBuilder: FormBuilder, public authUserService: UserAuthService, public router: Router) {}

  ngOnInit() {
    this.loginUser = LoginUser.empty();
    this.formGroup = this.createFormGroup();
    this.loginUserError = false;
  }

  login() {
    this.authUserService.login(this.loginUser).then(res => {
      this.loginUserError = false;
      this.router.navigate(['user','home'])
    }).catch(err => this.loginUserError = true);
  }
  goRegister(){
    this.router.navigate(['new-user']);
  }

  private createFormGroup() {
    return this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required, Validators.minLength(8)],
      }
    );
  }


}
