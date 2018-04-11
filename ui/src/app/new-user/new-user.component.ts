import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PasswordValidation} from "../validators/equal-validator.directive";
import {UserService} from "../shared/services/user.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  title = "Nuevo Usuario";
  public formGroup: FormGroup;
  public newUser: User;
  public registerUserError: boolean;
  public addingUser: boolean;

  constructor(public fb: FormBuilder, public userService: UserService, public router: Router, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Nuevo Usuario | Softies');
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
      this.router.navigate(['users']);
    }).catch(() => this.registerUserError = true)

  }

  private createFormControls() {
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
