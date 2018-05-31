import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../shared/services/product.service";
import {Product} from "../../shared/models/product.model";
import {Subcategory} from "../../shared/models/subcategory.model";
import {Category} from "../../shared/models/category.model";
import {SubcategoryService} from "../../shared/services/subcategory.service";
import {CategoryService} from "../../shared/services/category.service";
import {SupplierService} from "../../shared/services/supplier.service";
import {Supplier} from "../../shared/models/supplier.model";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {SupplierProduct} from "../../shared/models/supplier-product.model";
import {SupplierProductService} from "../../shared/services/supplierProduct.service";
import {BsModalService} from "ngx-bootstrap";
import {Report} from "../../shared/models/report.model";
import {ReportService} from "../../shared/services/report.service";


@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss'],
  providers: [BsModalService,
    ReportService,
    ProductService, SupplierProductService,
    SubcategoryService, CategoryService,
    SupplierService, UserAuthService]
})
export class UploadProductComponent implements OnInit {

  public formGroup: FormGroup;
  public userId: number;
  public newProduct: Product;
  public newSupplierProduct: SupplierProduct;
  public uploadProductError: boolean;
  public uploadProductImageError: boolean;
  public selectedCategoryId: number;
  public categories: Category[];
  public subcategories: Subcategory[];
  public suppliers: Supplier[];
  public file: File;
  public alerts: {
    subcategories: {
      loading: boolean,
      error: boolean,
    },
    categories: {
      loading: boolean,
      error: boolean,
    },
    suppliers: {
      loading: boolean,
      error: boolean,
    },
    adding: {
      product: boolean,
      productError: boolean,
      supplierProduct: boolean,
      supplierProductError: boolean,
      report: boolean,
      reportError: boolean,
    },
    file: {
      error: boolean,
    },
    success: boolean,
  };

  public reportSupplier: Report;
  public reportFormGroup: FormGroup;
  modalRef;

  constructor(public fb: FormBuilder, public router: Router, private titleService: Title,
              public modalService: BsModalService,
              private reportService: ReportService,
              private productService: ProductService, private  supplierProductService: SupplierProductService,
              private subcategoryService: SubcategoryService, private categoryService: CategoryService,
              private supplierService: SupplierService, private userAuthService: UserAuthService
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Carga de Producto | Stingy');

    this.initializeEmptyObjects();
    this.uploadProductError = false;
    this.userAuthService.loggedUser.then(res => this.userId = res.id);
    this.createFormControls();
    this.subcategories = [];
    this.getCategories();
    this.getSuppliers();
    this.alerts = {
      subcategories: {
        loading: false,
        error: false,
      },
      categories: {
        loading: true,
        error: false,
      },
      suppliers: {
        loading: false,
        error: false,
      },
      adding: {
        product: false,
        productError: false,
        supplierProduct: false,
        supplierProductError: false,
        report: false,
        reportError: false,
      },
      file: {
        error: false,
      },
      success: false,
    };

    this.modalRef = this.modalService;
  }


  getSubcategories() {
    this.subcategoryService.getSubcategoryByCategoryId(this.selectedCategoryId).then(res => {
      this.subcategories = res;
      this.alerts.subcategories.error = false;
      this.alerts.subcategories.loading = false;
    }).catch(err => {
      this.alerts.subcategories.error = true;
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories() {
    this.categoryService.categories.then(res => {
      this.categories = res;
      this.alerts.categories.error = false;
      this.alerts.categories.loading = false;
    }).catch(err => {
      this.alerts.categories.error = true;
      this.alerts.categories.loading = false;
    })
  }

  getSuppliers() {
    this.supplierService.suppliers.then(res => {
      this.suppliers = res;
      this.alerts.suppliers.error = false;
      this.alerts.suppliers.loading = false;
    }).catch(err => {
      console.log(err);
      this.alerts.suppliers.error = true;
      this.alerts.suppliers.loading = false;
    })
  }

  uploadProduct() {
    if (!this.file || this.file.size > 2000000) {
      this.alerts.file.error = true;
      return;
    } else {
      this.alerts.file.error = false;
      this.alerts.adding.product = true;
      this.newProduct.isValidated = false;
      this.newProduct.userId = this.userId;
      this.newProduct.subcategoryId = parseInt(String(this.newProduct.subcategoryId));
      this.productService.addProduct(this.newProduct)
        .then(res => {
          this.productService.addProductImage(res.id, this.file)
            .then(() => {
              this.alerts.adding.product = false;
              this.uploadProductError = false;

              this.uploadSupplierProduct();
            })
            .catch(() => {
              this.uploadProductImageError = true;
              setTimeout(() => {
                this.uploadProductImageError = false;
              }, 5000);
              this.alerts.adding.product = false;
            });
        })
        .catch(error => {
          this.alerts.adding.productError = true;
          setTimeout(() => {
            this.uploadProductError = false;
          }, 5000);
          this.alerts.adding.productError = false;
        });
    }
  }

  private uploadSupplierProduct() {
    this.alerts.file.error = false;
    this.alerts.adding.product = true;
    this.newSupplierProduct.supplierId = parseInt(String(this.newSupplierProduct.supplierId));
    this.supplierProductService.addSupplierProduct(this.newSupplierProduct)
      .then(res => {
        this.alerts.adding.supplierProduct = false;
        this.alerts.success = true;
        setTimeout(() => {
          this.alerts.success = false;
        }, 2500);
        this.resetUploadProduct();

      })
      .catch(error => {
        this.uploadProductError = true;
        setTimeout(() => {
          this.uploadProductError = false;
        }, 5000);
        this.alerts.adding.supplierProduct = false;
      });
  }

  private initializeEmptyObjects() {
    this.reportSupplier = Report.empty();
    this.newProduct = Product.empty();
    this.newSupplierProduct = SupplierProduct.empty();
    this.newSupplierProduct.productId = this.newProduct.id;
  }

  private resetUploadProduct() {
    this.formGroup.reset();
    this.newProduct = Product.empty();
    this.selectedCategoryId = -1;
    this.file = undefined;
  }

  private createFormControls() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      subcategoryId: [-1, [Validators.required, Validators.min(0)]],
      supplierId: [-1, [Validators.required, Validators.min(0)]],
    }, {})
  }

  imageSelect(event) {
    this.file = event.srcElement.files[0];
  };

  public openReportModal(template: TemplateRef<any>) {
    this.reportSupplier = Report.empty();
    this.createReportFormControl();
    this.modalRef = this.modalService.show(template);

  }

  private createReportFormControl() {
    this.reportFormGroup = this.fb.group({
      description: ['', Validators.required],
    }, {})
  }

  public sendReport() {
    this.reportService.addReport(this.reportSupplier)
      .then(res => {
        this.alerts.adding.report = false;
        this.alerts.success = true;
        setTimeout(() => {
          this.alerts.success = false;
        }, 2500);
      })
      .catch(error => {
        this.alerts.adding.reportError = true;
        setTimeout(() => {
          this.alerts.adding.reportError = false;
        }, 5000);
      });
  }

  resetModal() {
    this.reportSupplier = Report.empty();
    this.modalRef.hide();
  }

  uploadImage() {
    //TODO pegarle con un objeto multipartformdata con productid y el file a la ruta de add product image
  }


}
