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
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})
export class AdminProfileComponent implements OnInit {

  public formGroup: FormGroup;
  public user: User;
  public alerts: {
    updating: {
      loading: boolean,
    },
    getting: {
      loading: boolean,
    }
    delete:{
      loading: boolean;
    }
  };
  modalRef: BsModalRef;


  constructor(public fb: FormBuilder, public userService: AdminService, public router: Router, private titleService: Title, public authService: AdminAuthService, private modalService: BsModalService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.titleService.setTitle('Perfil Usuario | Stingy');
    this.user = User.empty();
    this.alerts = {
      updating: {
        loading: false,
      },
      getting: {
        loading: true,
      },
      delete:{
        loading: false,
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
      });
    }).catch(() => {
      this.alerts.getting.loading = false;
      this.snackBar.open('Hubo un error al obtener el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });    })
  }

  updateUser() {
    this.alerts.updating.loading = true;
    this.userService.updateUser(this.user).then( () => {
      this.alerts.updating.loading = false;
      this.snackBar.open('El usuario fué actualizado correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.updating.loading = false;
      this.snackBar.open('Hubo un error al actualizar el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
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
    this.userService.deleteUser(this.user.id).then(() => {
      this.snackBar.open('El usuario fué eliminado correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      this.alerts.delete.loading = false;
      this.authService.logout().then(() => {
        this.router.navigate(['admin', 'login']);
      })
    }).catch(() => {
      this.snackBar.open('Hubo un error al eliminar el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      this.alerts.delete.loading = true;
    })
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.alerts.delete.loading = true;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal(){
    this.alerts.delete.loading = false;
  }


}
