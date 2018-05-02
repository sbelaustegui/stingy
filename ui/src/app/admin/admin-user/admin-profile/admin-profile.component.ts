import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/models/user.model";
import {EmailValidation, PasswordValidation} from "../../../shared/validators/equal-validator.directive";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {AdminAuthService} from "../../../shared/auth/admin/admin-auth.service";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {AdminService} from "../../../shared/services/admin.service";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
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
    delete:{
      loading: boolean;
      error: boolean;
      success: boolean;

    }
  };
  modalRef: BsModalRef;


  constructor(public fb: FormBuilder, public userService: AdminService, public router: Router, private titleService: Title, public authService: AdminAuthService, private modalService: BsModalService) {}

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
      },
      delete:{
        loading: false,
        error: false,
        success: false,

      }
    };
    this.createFormControls();
    this.getUser();
  }

  getUser(){
    this.authService.loggedUser.then(res => {
      this.userService.getUserById(res.id).then(user => {
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
    this.userService.updateUser(this.user).then( () => {
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

  deleteUser(){
    this.alerts.delete.success = true;
    this.userService.deleteUser(this.user.id).then(res => {
      this.alerts.delete.success= true;
      this.alerts.delete.loading = false;
      this.authService.logout().then(() => {
        this.router.navigate(['admin', 'login']);
      })
    }).catch(() => {
      this.alerts.delete.error = true;
      this.alerts.delete.loading = true;
    })
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.alerts.delete.loading = true;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal(){
    this.alerts.delete.success = false;
    this.alerts.delete.loading = false;
  }


}
