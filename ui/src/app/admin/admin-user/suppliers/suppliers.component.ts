import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SupplierService} from "../../../shared/services/supplier.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {Supplier} from "../../../shared/models/supplier.model";
import {ReportService} from "../../../shared/services/report.service";
import {Report} from "../../../shared/models/report.model";
import {User} from "../../../shared/models/user.model";
import {UserService} from "../../../shared/services/user.service";
import {Location} from "../../../shared/models/location.model";
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {ReportStatisticsModel} from "../../../shared/models/report-statistics.model";
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [SupplierService, ReportService, UserService]
})

export class SuppliersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator:  MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  supplier_Columns = ['id', 'name', 'description', 'update', 'remove'];
  supplier_DataSource: MatTableDataSource<Supplier>;

  report_Columns = ['id', 'userId', 'description','date', 'solve', 'remove'];
  report_DataSource: MatTableDataSource<Report>;

  public suppliersMap: Map<number,Supplier>;
  public reportsMap: Map<number,Report>;

  public supplierFormGroup: FormGroup;
  public newSupplier: Supplier;
  public supplierToDelete: Supplier;
  public report: Report;
  public reportToDelete: Report;
  public unresolvedReports: Report[];
  public requester: User;
  public requesters: Map<number, User>;
  public alerts: {
    reports: {
      loading: boolean,
      deleting: boolean,
    },
    requester: {
      loading: boolean,
      deleting: boolean,
    },
    suppliers: {
      loading: boolean,
      deleting: boolean,
    },
    addSupplier: {
      loading: boolean,
    },
  };
  modalRef: BsModalRef;
  public location: Location;

  constructor(public fb: FormBuilder, public router: Router, private titleService: Title, private modalService: BsModalService,
              public supplierService: SupplierService, public reportService: ReportService, public userService: UserService, public snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.suppliersMap = new Map<number, Supplier>();
    this.reportsMap = new Map<number, Report>();

    this.location = Location.empty();
    this.unresolvedReports = [];
    this.titleService.setTitle('Provedores | Stingy');
    this.newSupplier = Supplier.empty();
    this.report = Report.empty();
    this.requester = User.empty();
    this.requesters = new Map<number, User>();
    this.alerts = {
      reports: {
        loading: true,
        deleting: false,
      },
      requester: {
        loading: true,
        deleting: false,
      },
      suppliers: {
        loading: true,
        deleting: false,
      },
      addSupplier: {
        loading: false,
      },
    };
    this.createFormControls();
    this.getSuppliers();
    this.getUnresolveReports();
  }

  getSuppliers() {
    this.supplierService.suppliers.then(res => {
      this.alerts.suppliers.loading = true;

      res.forEach( s => {
        this.suppliersMap.set(s.id,s);
      });
      this.setSuppliersData();

      this.alerts.suppliers.loading = false;
    }).catch(err => {
      this.snackBar.open('Hubo un error al obtener los proveedores, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });      this.alerts.suppliers.loading = false;
    })
  }

  getUnresolveReports() {
    this.reportService.getUnresolveReports()
      .then(res => {
        this.alerts.reports.loading = true;
        res.forEach(r => {
          // this.unresolvedReports.push(Report.from(r));
          this.reportsMap.set(r.id,Report.from(r));
          this.getRequester(r.userId);
        });
        this.setReportsData();
        this.alerts.reports.loading = false;
      })
      .catch(error => {
        this.snackBar.open('Hubo un error al obtener los reportes, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
        this.alerts.reports.loading = false;
      })

  }

  private getRequester(userId: number) {
    if(!this.requesters.has(userId)) {
      this.userService.getUserById(userId)
        .then(user => {
          this.userService.getUserReportStatistics(user.id)
            .then((statistic: ReportStatisticsModel) => {
              user.acceptedReportsPercentage = Math.floor((statistic.solved / statistic.total) * 100);
              this.requesters.set(user.id, user);
            })
        }).catch(err => {
        this.snackBar.open('Hubo un error al obtener los datos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    }
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
          // this.suppliersArray.splice(this.suppliersArray.findIndex(a => a.id === res.id), 1);
          // this.suppliersArray.push(res);
          this.suppliersMap.set(res.id,res);
          this.refreshSupplierTable();
          this.alerts.addSupplier.loading = false;
          this.newSupplier = Supplier.empty();
          this.supplierFormGroup.reset();
          this.modalRef.hide();
          this.snackBar.open('El proveedor se actualizó correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top'
          });
          return true;
        })
        .catch(() => {
          this.alerts.addSupplier.loading = false;
          this.snackBar.open('Hubo un error al actualizar el proveedor, por favor inténtelo nuevamente. Revise que el nombre sea válido y no se encuentre repetido.', '', {
            duration: 5000,
            verticalPosition: 'top'
          });
        })
    }
    else {
      this.alerts.addSupplier.loading = true;
      this.supplierService.addSupplier(this.newSupplier)
        .then(res => {
          // this.suppliersArray.push(res);
          this.suppliersMap.set(res.id,res);
          this.refreshSupplierTable();
          this.alerts.addSupplier.loading = false;
          this.newSupplier = Supplier.empty();
          this.supplierFormGroup.reset();
          this.modalRef.hide();
          this.snackBar.open('El proveedor se agregó correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top'
          });
          return true;
        })
        .catch(() => {
          this.alerts.addSupplier.loading = false;
          this.snackBar.open('Hubo un error al agregar el proveedor, por favor inténtelo nuevamente. Revise que el nombre sea válido y no se encuentre repetido.', '', {
            duration: 5000,
            verticalPosition: 'top'
          });
        })
    }
    return false;
  }

  deleteSupplier() {
    this.alerts.suppliers.deleting = true;
    this.supplierService.deleteSupplier(this.supplierToDelete.id).then(() => {
      // this.suppliersArray.splice(this.supplierIndexToDelete, 1);
      this.suppliersMap.delete(this.supplierToDelete.id);
      this.refreshSupplierTable();
      this.alerts.suppliers.deleting = false;
      this.modalRef.hide();
      this.snackBar.open('El proveedor se eliminó correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.suppliers.deleting = false;
      this.snackBar.open('Hubo un error al eliminar el proveedor, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
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
        this.snackBar.open('Hubo un error al marcar como resuelto un reporte, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
  }


  deleteReport() {
    this.alerts.reports.deleting = true;
    this.reportService.deleteReport(this.reportToDelete.id).then(() => {
      // this.unresolvedReports.splice(this.reportIndexToDelete, 1);
      this.reportsMap.delete(this.reportToDelete.id);
      this.refreshReportsTable();
      this.alerts.reports.deleting = false;
      this.modalRef.hide();
      this.snackBar.open('El reporte se eliminó correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.reports.deleting = false;
      this.snackBar.open('Hubo un error al eliminar el reporte, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
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
                  id: number) {

    if (id) {
      switch (modalReference.toUpperCase()) {
        case "REPORT":
          const r = Object.assign({},this.reportsMap.get(id));
          this.report = r;
          break;
        case "REPORTDELETE":
          this.reportToDelete = this.reportsMap.get(id);
          break;
      }
    }
    this.modalRef = this.modalService.show(template);
  }

  openSupplierModal(template: TemplateRef<any>, modalReference: string,
                    id?: number) {
    if (id) {
      switch (modalReference.toUpperCase()) {
        case "SUPPLIER":
          const s = this.suppliersMap.get(id);
          this.newSupplier = Object.assign({},s);
          break;
        case "SUPPLIERDELETE":
          this.supplierToDelete = this.suppliersMap.get(id);
          break;
      }
    }
    else {
      if (modalReference.toUpperCase() == "NEWSUPPLIER") {
        this.newSupplier = this.emptySupplier();
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
        break;
      case "REQUESTER":
        this.requester = User.empty();
        break;

      case "REPORTDELETE":
        this.reportToDelete = Report.empty();
        break;
    }
  }

  emptySupplier(): Supplier {
    return Supplier.empty();
  }

  applyReportsFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.report_DataSource.filter = filterValue;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.supplier_DataSource.filter = filterValue;
  }

  private setSuppliersData() {
    this.supplier_DataSource = new MatTableDataSource(Array.from(this.suppliersMap.values()));
    this.supplier_DataSource.paginator = this.paginator;
    this.supplier_DataSource.sort = this.sort;
  }

  private refreshSupplierTable() {
    this.supplier_DataSource.data = Array.from(this.suppliersMap.values());
  }

  private setReportsData() {
    this.report_DataSource = new MatTableDataSource(Array.from(this.reportsMap.values()));
    this.report_DataSource.paginator = this.paginator;
    this.report_DataSource.sort = this.sort;
  }

  private refreshReportsTable() {
    this.report_DataSource.data = Array.from(this.reportsMap.values());
  }
}
