import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/models/user.model";
import {EmailValidation, PasswordValidation} from "../../shared/validators/equal-validator.directive";
import {UserService} from "../../shared/services/user.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {

  public formGroup: FormGroup;
  public user: User;
  public alerts: {
    updating: {
      loading: boolean,
    },
    getting: {
      loading: boolean,
    }
    delete: {
      loading: boolean;
    }
  };
  modalRef: BsModalRef;


  constructor(public fb: FormBuilder, public userService: UserService, public router: Router, private titleService: Title, public authService: UserAuthService, private modalService: BsModalService, public snackBar: MatSnackBar) {
  }

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
      delete: {
        loading: false,
      }
    };
    this.createFormControls();
    this.getUser();
  }

  getUser() {
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
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
    })
  }

  updateUser() {
    this.alerts.updating.loading = true;
    this.userService.updateUser(this.user).then(() => {
      this.alerts.updating.loading = false;
      this.snackBar.open('El usuario se actualizó correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-success']

      });
    }).catch(() => {
      this.alerts.updating.loading = false;
      this.snackBar.open('Hubo un error al actualizar el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

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

  deleteUser() {
    this.userService.deleteUser(this.user.id).then(res => {
      this.snackBar.open('El usuario se eliminó correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-success']

      });
      this.router.navigate(['login']);
    }).catch(err => {
      this.snackBar.open('Hubo un error al eliminar el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
    });
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.alerts.delete.loading = true;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal() {
    this.alerts.delete.loading = false;
  }


}
