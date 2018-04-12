import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../shared/services/user.service";
import {Title} from "@angular/platform-browser";
import {User} from "../shared/models/user.model";
import {EmailValidation, PasswordValidation} from "../shared/validators/equal-validator.directive";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
  providers: [UserService]
})
export class NewUserComponent implements OnInit {
  title = "Nuevo Usuario";
  public formGroup: FormGroup;
  public newUser: User;
  public registerUserError: boolean;
  public addingUser: boolean;

  constructor(public fb: FormBuilder, public userService: UserService, public router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Nuevo Usuario | Stingy');
    this.newUser = User.empty();
    this.addingUser = false;
    this.registerUserError = false;
    this.createFormControls();
  }

  registerUser() {
    this.addingUser = true;
    this.userService.addUser(this.newUser).then( () => {
      this.addingUser = false;
      this.registerUserError = false;
      this.router.navigate(['login']);
    }).catch(() => {
      this.registerUserError = true;
      this.addingUser = false;
    })

  }

  private createFormControls() {
    this.formGroup = this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      }, {
        validator: Validators.compose([PasswordValidation.MatchPassword, EmailValidation.MatchEmail])
      })
  }

}
