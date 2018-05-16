import {Component, OnInit, TemplateRef} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AdminService} from "../../../shared/services/admin.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {User} from "../../../shared/models/user.model";
import {EmailValidation, PasswordValidation} from "../../../shared/validators/equal-validator.directive";

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
  providers: [AdminService]
})
export class AdminsComponent implements OnInit {

  public adminFormGroup: FormGroup;
  public newAdmin: User;
  public adminToDelete: User;
  public adminIndexToDelete: number;
  public adminsArray: User[];
  public adminsPage: number = 1;
  public alerts: {
    admins: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
    },
    addAdmin: {
      error: boolean,
      loading: boolean,
    },
    success: boolean
  };
  modalRef: BsModalRef;

  constructor(public fb: FormBuilder, public adminService: AdminService, public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newAdmin = User.empty();
    this.alerts = {
      admins: {
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
      },
      addAdmin: {
        error: false,
        loading: false,
      },
      success: false
    };
    this.createFormControls();
    this.getAdmins();
  }

  getAdmins() {
    this.adminService.users.then(res => {
      this.adminsArray = res;
      this.alerts.admins.error = false;
      this.alerts.admins.loading = false;
    }).catch(err => {
      //TODO mostrar en el front mensaje de error
      this.alerts.admins.error = true;
      this.alerts.admins.loading = false;
    })
  }

  uploadAdmin() {
    if(this.newAdmin.id){
      this.alerts.addAdmin.loading = true;
      this.adminService.updateUser(this.newAdmin).then(res => {
        this.adminsArray.splice(this.adminsArray.findIndex(a => a.id === res.id),1);
        this.adminsArray.push(res);
        this.alerts.addAdmin.loading = false;
        this.alerts.addAdmin.error = false;
        this.newAdmin = User.empty();
        this.adminFormGroup.reset();
        this.modalRef.hide();
        this.alerts.success = true;
        setTimeout(() => {
          this.alerts.success = false;
        }, 2500);
      }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addAdmin.loading = false;
        this.alerts.addAdmin.error = true;
        setTimeout(() => {
          this.alerts.addAdmin.error = false;
        }, 2500);
      })
    } else {
      this.alerts.addAdmin.loading = true;
      this.adminService.addUser(this.newAdmin).then(res => {
        this.adminsArray.push(res);
        this.alerts.addAdmin.loading = false;
        this.alerts.addAdmin.error = false;
        this.newAdmin = User.empty();
        this.adminFormGroup.reset();
        this.modalRef.hide();
        this.alerts.success = true;
        setTimeout(() => {
          this.alerts.success = false;
        }, 2500);
      }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addAdmin.loading = false;
        this.alerts.addAdmin.error = true;
        setTimeout(() => {
          this.alerts.addAdmin.error = false;
        }, 2500);
      })
    }
  }

  deleteAdmin() {
    this.alerts.admins.deleting = true;
    this.adminService.deleteUser(this.adminToDelete.id).then(res => {
      this.adminsArray.splice(this.adminIndexToDelete,1);
      // this.deleteSubAdmins();
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.admins.deleting = false;
      this.alerts.admins.deletingError = false;
      this.modalRef.hide();
      this.alerts.success = true;
      setTimeout(() => {this.alerts.success = false;},2500);
    }).catch(() => {
      this.alerts.admins.deleting = false;
      this.alerts.admins.deletingError = true;
      setTimeout(() => {this.alerts.admins.deletingError = false;},5000);
    })
  }

  private createFormControls() {
    this.adminFormGroup = this.fb.group({
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

  openAdminModal(template: TemplateRef<any>, admin?) {
    if(admin) this.newAdmin = Object.assign({}, admin);
    this.adminFormGroup.controls['confirmPassword'].setValue(this.newAdmin.password);
    this.modalRef = this.modalService.show(template);
  }

  openAdminDeleteModal(template: TemplateRef<any>, admin, i) {
    this.adminToDelete = admin;
    this.adminIndexToDelete = i;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal(){
    this.adminToDelete = undefined;
    this.adminIndexToDelete = -1;
  }

  resetModal(){
    this.newAdmin = User.empty();
    this.adminFormGroup.reset();
    this.modalRef.hide();
  }
}
