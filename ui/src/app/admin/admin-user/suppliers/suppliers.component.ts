import {Component, NgZone, OnInit, TemplateRef} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SupplierService} from "../../../shared/services/supplier.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {Supplier} from "../../../shared/models/supplier.model";
import {MapsAPILoader} from "@agm/core";
import {google} from "@agm/core/services/google-maps-types";
import {ReportService} from "../../../shared/services/report.service";
import {Report} from "../../../shared/models/report.model";
import {User} from "../../../shared/models/user.model";
import {UserService} from "../../../shared/services/user.service";
import {Location} from "../../../shared/models/location.model";

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [SupplierService, ReportService, UserService]
})

export class SuppliersComponent implements OnInit {

  public supplierFormGroup: FormGroup;
  public newSupplier: Supplier;
  public supplierToDelete: Supplier;
  public supplierIndexToDelete: number;
  public suppliersArray: Supplier[];
  public suppliersPage: number = 1;
  public report: Report;
  public reportToDelete: Report;
  public reportIndexToDelete: number;
  public unresolvedReports: Report[];
  public reportsPage: number = 1;
  public requester: User;
  public requesters: Map<number, User>;
  public alerts: {
    reports: {
      success: boolean;
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
    },
    requester: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
    },
    suppliers: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
    },
    addSupplier: {
      error: boolean,
      loading: boolean,
    },
    success: boolean
  };
  modalRef: BsModalRef;
  public location: Location;

  constructor(public fb: FormBuilder, public router: Router, private titleService: Title, private modalService: BsModalService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone,
              public supplierService: SupplierService, public reportService: ReportService, public userService: UserService
  ) {
  }

  ngOnInit() {
    this.location = Location.empty();
    this.unresolvedReports = [];
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newSupplier = Supplier.empty();
    this.report = Report.empty();
    this.requester = User.empty();
    this.requesters = new Map<number, User>();
    this.alerts = {
      reports: {
        success: false,
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
      },
      requester: {
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
      },
      suppliers: {
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
      },
      addSupplier: {
        error: false,
        loading: false,
      },
      success: false
    };
    this.createFormControls();
    this.getSuppliers();
    this.getUnresolveReports();
  }

  getSuppliers() {
    this.supplierService.suppliers.then(res => {
      this.alerts.suppliers.loading = true;
      this.suppliersArray = res;

      this.alerts.suppliers.error = false;
      this.alerts.suppliers.loading = false;
    }).catch(err => {
      this.alerts.suppliers.error = true;
      this.alerts.suppliers.loading = false;
    })
  }

  getUnresolveReports() {
    this.reportService.getUnresolveReports()
      .then(res => {
        this.alerts.reports.loading = true;
        res.forEach(r => {
          this.unresolvedReports.push(Report.from(r));
          this.getRequester(r.userId);
        });
        this.alerts.reports.error;
        this.alerts.reports.loading = false;
      })
      .catch(error => {
        console.log(error.message,);
        this.alerts.reports.error = true;
        this.alerts.reports.loading = false;
      })

  }

  private getRequester(userId: number) {
    this.userService.getUserById(userId)
      .then(res => {
        this.requesters.set(res.id, res);
      })
  };

  getRequesterFromMap(userId: number): User {
    if (this.requesters.has(userId))
      this.requester = this.requesters.get(userId);
    return this.requester;

    // return this.requesters.has(userId) ?
    //   this.requesters.get(userId)
    //   : User.empty();
  }

  uploadSupplier(): boolean {
    if (this.newSupplier.id) {
      this.alerts.addSupplier.loading = true;
      this.supplierService.updateSupplier(this.newSupplier)
        .then(res => {
          this.suppliersArray.splice(this.suppliersArray.findIndex(a => a.id === res.id), 1);
          this.suppliersArray.push(res);
          this.alerts.addSupplier.loading = false;
          this.alerts.addSupplier.error = false;
          this.newSupplier = Supplier.empty();
          this.supplierFormGroup.reset();
          this.modalRef.hide();
          this.alerts.success = true;
          setTimeout(() => {
            this.alerts.success = false;
          }, 2500);
          return true;
        })
        .catch(() => {
          //TODO mostrar en el front mensaje de error
          this.alerts.addSupplier.loading = false;
          this.alerts.addSupplier.error = true;
          setTimeout(() => {
            this.alerts.addSupplier.error = false;
          }, 2500);
        })
    }
    else {
      this.alerts.addSupplier.loading = true;
      this.supplierService.addSupplier(this.newSupplier)
        .then(res => {
          this.suppliersArray.push(res);
          this.alerts.addSupplier.loading = false;
          this.alerts.addSupplier.error = false;
          this.newSupplier = Supplier.empty();
          this.supplierFormGroup.reset();
          this.modalRef.hide();
          this.alerts.success = true;
          setTimeout(() => {
            this.alerts.success = false;
          }, 2500);
          return true;
        })
        .catch(() => {
          //TODO mostrar en el front mensaje de error
          this.alerts.addSupplier.loading = false;
          this.alerts.addSupplier.error = true;
          setTimeout(() => {
            this.alerts.addSupplier.error = false;
          }, 2500);
        })
    }
    return false;
  }

  deleteSupplier() {
    this.alerts.suppliers.deleting = true;
    this.supplierService.deleteSupplier(this.supplierToDelete.id).then(() => {
      this.suppliersArray.splice(this.supplierIndexToDelete, 1);
      // this.deleteSubSuppliers();
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.suppliers.deleting = false;
      this.alerts.suppliers.deletingError = false;
      this.modalRef.hide();
      this.alerts.success = true;
      setTimeout(() => {
        this.alerts.success = false;
      }, 2500);
    }).catch(() => {
      this.alerts.suppliers.deleting = false;
      this.alerts.suppliers.deletingError = true;
      setTimeout(() => {
        this.alerts.suppliers.deletingError = false;
      }, 5000);
    })
  }

  uploadSupplierBySolvingReport() {
    this.report.solved = true;
    this.reportService.resolveReport(this.report.id)
      .then( () => {
        this.unresolvedReports.splice(this.unresolvedReports.findIndex(r => r.id == this.report.id), 1);
        this.getUnresolveReports();
        this.uploadSupplier();
      })
      .catch(error => {
        console.log(error.message);
        this.alerts.reports.error = true;
        setTimeout(() => {
          this.alerts.reports.error = false;
        }, 5000);
      })
  }


  deleteReport() {
    this.alerts.reports.deleting = true;
    this.reportService.deleteReport(this.reportToDelete.id).then(() => {
      this.unresolvedReports.splice(this.reportIndexToDelete, 1);
      this.alerts.reports.deleting = false;
      this.alerts.reports.deletingError = false;
      this.modalRef.hide();
      this.alerts.reports.success = true;
      setTimeout(() => {
        this.alerts.reports.success = false;
      }, 2500);
    }).catch(() => {
      this.alerts.reports.deleting = false;
      this.alerts.reports.deletingError = true;
      setTimeout(() => {
        this.alerts.reports.deletingError = false;
      }, 5000);
    })
  }

  placeMarker($event) {
    this.newSupplier.location.latitude = $event.coords.lat;
    this.newSupplier.location.longitude = $event.coords.lng;
  }

  private createFormControls() {
    this.supplierFormGroup = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  openReportModal(template: TemplateRef<any>, modalReference: string,
                  report: Report, index?: number) {

    if (report) {
      switch (modalReference.toUpperCase()) {
        case "REPORT":
          this.report = report;
          break;
        case "REPORTDELETE":
          this.reportToDelete = report;
          this.reportIndexToDelete = index;
          break;
      }
    }
    this.modalRef = this.modalService.show(template);
  }

  openSupplierModal(template: TemplateRef<any>, modalReference: string,
                    supplier: Supplier, index?: number) {
    if (supplier) {
      switch (modalReference.toUpperCase()) {
        case "SUPPLIER":
          this.newSupplier = supplier;
          break;

        case "SUPPLIERDELETE":
          this.supplierToDelete = supplier;
          this.supplierIndexToDelete = index;
          break;
      }
    }
    this.modalRef = this.modalService.show(template);
  }

  openRequesterModal(template: TemplateRef<any>, modalReference: string,
                     requester: User, index?: number) {

    if (requester) {
      switch (modalReference.toUpperCase()) {
        case "REQUESTER":
          this.requester = requester;
          this.newSupplier = Supplier.empty();
          break;
      }
    }
    this.modalRef = this.modalService.show(template);
  }

  resetModal(reference: string) {
    this.modalRef.hide();
    switch (reference.toUpperCase()) {
      case "SUPPLIER":
        this.newSupplier = Supplier.empty();
        this.report = Report.empty();
        break;
      case "SUPPLIERDELETE":
        this.supplierToDelete = Supplier.empty();
        this.supplierIndexToDelete = -1;
        break;
      case "REQUESTER":
        this.requester = User.empty();
        break;

      case "REPORTDELETE":
        this.reportToDelete = Report.empty();
        this.reportIndexToDelete = -1;
        break;
    }
  }

  emptySupplier(): Supplier {
    return Supplier.empty();
  }
}
