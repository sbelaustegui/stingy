import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AdminService} from "../../../shared/services/admin.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {User} from "../../../shared/models/user.model";
import {EmailValidation, PasswordValidation} from "../../../shared/validators/equal-validator.directive";
import {AdminAuthService} from "../../../shared/auth/admin/admin-auth.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss'],
})
export class AdminsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['id', 'username', 'name', 'lastName', 'email', 'update', 'remove'];
  dataSource: MatTableDataSource<User>;

  public adminFormGroup: FormGroup;
  public newAdmin: User;
  public loggedAdmin: User;
  public adminToDelete: User;
  public adminsMap: Map<number, User>;
  public alerts: {
    admins: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
      deletingErrorLogged: boolean,
    },
    addAdmin: {
      error: boolean,
      loading: boolean,
    },
    success: boolean
  };
  modalRef: BsModalRef;

  constructor(public fb: FormBuilder, public adminService: AdminService, public router: Router, private titleService: Title, private modalService: BsModalService, public authService: AdminAuthService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Administradores | Stingy');
    this.newAdmin = User.empty();
    this.adminsMap = new Map<number, User>();
    this.authService.loggedUser.then(user => {
      this.loggedAdmin = user;
    }).catch(err => {
      this.alerts.admins.error = true;
    });
    this.alerts = {
      admins: {
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
        deletingErrorLogged: false,
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
    this.alerts.admins.loading = true;
    this.adminService.users.then(res => {
      res.forEach(admin => {
        this.adminsMap.set(admin.id, admin);
      });
      this.setData();
      this.alerts.admins.error = false;
      this.alerts.admins.loading = false;
    }).catch(err => {
      //TODO mostrar en el front mensaje de error
      this.alerts.admins.error = true;
      this.alerts.admins.loading = false;
    })
  }

  uploadAdmin() {
    if (this.newAdmin.id) {
      this.alerts.addAdmin.loading = true;
      this.adminService.updateUser(this.newAdmin).then(res => {
        this.adminsMap.set(res.id, res);
        this.refreshTable();
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
        // this.adminsArray.push(res);
        this.adminsMap.set(res.id, res);
        this.refreshTable();
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
    if (this.adminToDelete.id === this.loggedAdmin.id) {
      this.alerts.admins.deletingErrorLogged = true;
      setTimeout(() => this.alerts.admins.deletingErrorLogged = false, 3000);
      return;
    }
    this.alerts.admins.deletingErrorLogged = false;
    this.alerts.admins.deleting = true;
    this.adminService.deleteUser(this.adminToDelete.id).then(res => {
      // this.adminsArray.splice(this.adminIndexToDelete,1);
      this.adminsMap.delete(this.adminToDelete.id);
      this.refreshTable();
      this.alerts.admins.deleting = false;
      this.alerts.admins.deletingError = false;
      this.modalRef.hide();
      this.alerts.success = true;
      setTimeout(() => {
        this.alerts.success = false;
      }, 2500);
    }).catch(() => {
      this.alerts.admins.deleting = false;
      this.alerts.admins.deletingError = true;
      setTimeout(() => {
        this.alerts.admins.deletingError = false;
      }, 5000);
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

  openAdminModal(template: TemplateRef<any>, id?) {
    if (id) this.newAdmin = Object.assign({}, this.adminsMap.get(id));
    this.adminFormGroup.controls['confirmPassword'].setValue(this.newAdmin.password);
    this.modalRef = this.modalService.show(template);
  }

  openAdminDeleteModal(template: TemplateRef<any>, id: number) {
    this.adminToDelete = this.adminsMap.get(id);
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal() {
    this.adminToDelete = User.empty();
  }

  resetModal() {
    this.newAdmin = User.empty();
    this.adminFormGroup.reset();
    this.modalRef.hide();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  private setData() {
    this.dataSource = new MatTableDataSource(Array.from(this.adminsMap.values()));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private refreshTable() {
    // this.dataSource = new MatTableDataSource(this.adminsArray);
    this.dataSource.data = Array.from(this.adminsMap.values());
  }
}
