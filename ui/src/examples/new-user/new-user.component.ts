import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PasswordValidation} from '../validators/equal-validator.directive';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserService} from "../../app/shared/services/user.service";

// @Component({
//   selector: 'app-new-user',
//   templateUrl: './new-user.component.html',
//   styleUrls: ['./new-user.component.css'],
//   providers: [UserService]
// })
export class NewUserComponent implements OnInit {

  public formGroup: FormGroup;
  public newUser: User;
  public addingUserError: boolean;
  public addingUser: boolean;

  constructor(public fb: FormBuilder, public userService: UserService, public router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Nuevo Usuario | Softies');
    this.newUser = User.empty();
    this.addingUser = false;
    this.addingUserError = false;
    this.createFormControls();
  }

  addUser() {
    this.addingUser = true;
    this.userService.addUser(this.newUser).then( () => {
      this.addingUser = false;
      this.addingUserError = false;
      this.router.navigate(['users']);
    }).catch(() => this.addingUserError = true)

  }

  createFormControls() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    },
      {
      validator: PasswordValidation.MatchPassword
    })
  }
}
