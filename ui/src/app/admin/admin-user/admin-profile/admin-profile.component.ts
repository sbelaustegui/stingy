import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/models/user.model";
import {EmailValidation, PasswordValidation} from "../../../shared/validators/equal-validator.directive";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {AdminAuthService} from "../../../shared/auth/admin/admin-auth.service";
import {AdminService} from "../../../shared/services/admin.service";

@Component({
  selector: 'app-admin-profile',
  templateUrl: 'admin-profile.component.html',
  styleUrls: ['admin-profile.component.scss'],
  providers: [AdminService]
})
export class AdminProfileComponent implements OnInit {

  public formGroup: FormGroup;
  public user: User;
  public alerts: {
    updating: {
      loading: boolean,
      error: boolean,
      success: boolean,
    },
    getting: {
      loading: boolean,
      error: boolean,
    }
  };

  constructor(public fb: FormBuilder, public adminService: AdminService, public router: Router, private titleService: Title, public adminAuthService: AdminAuthService) {}

  ngOnInit() {
    this.titleService.setTitle('Perfil Usuario | Stingy');
    this.user = User.empty();
    this.alerts = {
      updating: {
        loading: false,
        error: false,
        success: false,
      },
      getting: {
        loading: true,
        error: false,
      }
    };
    this.createFormControls();
    this.getUser();
  }

  getUser(){
    this.adminAuthService.loggedUser.then(res => {
      this.adminService.getUserById(res.id).then(user => {
        this.user = user;
        this.user.password = '';
        this.alerts.getting.loading = false;
        this.alerts.getting.error = false;
      });
    }).catch(() => {
      this.alerts.getting.error = true;
      this.alerts.getting.loading = false;
      setTimeout(() => this.alerts.getting.error = false , 5000)
    })
  }

  updateUser() {
    this.alerts.updating.loading = true;
    this.adminService.updateUser(this.user).then( () => {
      this.alerts.updating.loading = false;
      this.alerts.updating.error = false;
      this.alerts.updating.success = true;
      setTimeout(() => this.alerts.updating.success = false , 5000)
    }).catch(() => {
      this.alerts.updating.loading = false;
      this.alerts.updating.error = true;
      this.alerts.updating.success = false;
      setTimeout(() => this.alerts.updating.error = false , 5000)
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
