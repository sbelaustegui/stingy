import {Component, OnInit, TemplateRef} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {SupplierService} from "../../../shared/services/supplier.service";
import {BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {Supplier} from "../../../shared/models/supplier.model";

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss'],
  providers: [SupplierService]
})

export class SuppliersComponent implements OnInit {

  public supplierFormGroup: FormGroup;
  public newSupplier: Supplier;
  public supplierToDelete: Supplier;
  public supplierIndexToDelete: number;
  public suppliersArray: Supplier[];
  public suppliersPage: number = 1;
  public alerts: {
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

  constructor(public fb: FormBuilder, public supplierService: SupplierService, public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newSupplier = Supplier.empty();
    this.alerts = {
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
  }

  getSuppliers() {
    this.supplierService.suppliers.then(res => {
      this.suppliersArray = res;

      this.alerts.suppliers.error = false;
      this.alerts.suppliers.loading = false;
    }).catch(err => {
      //TODO mostrar en el front mensaje de error
      this.alerts.suppliers.error = true;
      this.alerts.suppliers.loading = false;
    })
  }

  uploadSupplier() {
    if(this.newSupplier.id){
      this.alerts.addSupplier.loading = true;
      this.supplierService.updateSupplier(this.newSupplier).then(res => {
        this.suppliersArray.splice(this.suppliersArray.findIndex(a => a.id === res.id),1);
        this.suppliersArray.push(res);
        this.alerts.addSupplier.loading = false;
        this.alerts.addSupplier.error = false;
        this.newSupplier = Supplier.empty();
        this.supplierFormGroup.reset();
        this.modalRef.hide();
        this.alerts.success = true;
        setTimeout(() => {this.alerts.success = false;},2500);    }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addSupplier.loading = false;
        this.alerts.addSupplier.error = true;
        setTimeout(() => {this.alerts.addSupplier.error = false;},2500);
      })
    } else {
      this.alerts.addSupplier.loading = true;
      this.supplierService.addSupplier(this.newSupplier).then(res => {
        this.suppliersArray.push(res);
        this.alerts.addSupplier.loading = false;
        this.alerts.addSupplier.error = false;
        this.newSupplier = Supplier.empty();
        this.supplierFormGroup.reset();
        this.modalRef.hide();
        this.alerts.success = true;
        setTimeout(() => {this.alerts.success = false;},2500);    }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addSupplier.loading = false;
        this.alerts.addSupplier.error = true;
        setTimeout(() => {this.alerts.addSupplier.error = false;},2500);
      })
    }
  }

  deleteSupplier() {
    this.alerts.suppliers.deleting = true;
    this.supplierService.deleteSupplier(this.supplierToDelete.id).then(res => {
      this.suppliersArray.splice(this.supplierIndexToDelete,1);
      // this.deleteSubSuppliers();
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.suppliers.deleting = false;
      this.alerts.suppliers.deletingError = false;
      this.modalRef.hide();
      this.alerts.success = true;
      setTimeout(() => {this.alerts.success = false;},2500);
    }).catch(() => {
      this.alerts.suppliers.deleting = false;
      this.alerts.suppliers.deletingError = true;
      setTimeout(() => {this.alerts.suppliers.deletingError = false;},5000);
    })
  }

  private createFormControls() {
    this.supplierFormGroup = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
    })
  }

  openSupplierModal(template: TemplateRef<any>, supplier?) {
    if(supplier) this.newSupplier = Object.assign({}, supplier);
    this.modalRef = this.modalService.show(template);
  }

  openSupplierDeleteModal(template: TemplateRef<any>, supplier, i) {
    this.supplierToDelete = supplier;
    this.supplierIndexToDelete = i;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal(){
    this.supplierToDelete = undefined;
    this.supplierIndexToDelete = -1;
    }
}
