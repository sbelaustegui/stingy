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
import {MatSnackBar} from "@angular/material";


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
  public selectedCategoryId: number;
  public categories: Category[];
  public subcategories: Subcategory[];
  public suppliers: Supplier[];
  public file: File;
  public alerts: {
    subcategories: {
      loading: boolean,
    },
    categories: {
      loading: boolean,
    },
    suppliers: {
      loading: boolean,
    },
    adding: {
      product: boolean,
      supplierProduct: boolean,
      report: boolean,
    },
  };

  public newReportSupplier: Report;
  public reportFormGroup: FormGroup;
  modalRef;

  constructor(public fb: FormBuilder, public router: Router, private titleService: Title,
              public modalService: BsModalService,
              private reportService: ReportService,
              private productService: ProductService, private  supplierProductService: SupplierProductService,
              private subcategoryService: SubcategoryService, private categoryService: CategoryService,
              private supplierService: SupplierService, private userAuthService: UserAuthService, public snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Carga de Producto | Stingy');
    this.initializeEmptyObjects();
    this.userAuthService.loggedUser.then(res => this.userId = res.id);
    this.createFormControls();
    this.subcategories = [];
    this.getCategories();
    this.getSuppliers();
    this.alerts = {
      subcategories: {
        loading: false,
      },
      categories: {
        loading: true,
      },
      suppliers: {
        loading: false,
      },
      adding: {
        product: false,
        supplierProduct: false,
        report: false,
      },
    };

    this.modalRef = this.modalService;
  }


  getSubcategories() {
    this.subcategoryService.getSubcategoryByCategoryId(this.selectedCategoryId).then(res => {
      this.subcategories = res;
      this.alerts.subcategories.loading = false;
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener las subcategorias, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories() {
    this.categoryService.categories.then(res => {
      this.categories = res;
      this.alerts.categories.loading = false;
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener las categorias, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
      this.alerts.categories.loading = false;
    })
  }

  getSuppliers() {
    this.supplierService.suppliers.then(res => {
      this.suppliers = res;
      this.alerts.suppliers.loading = false;
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener los proveedores, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
      this.alerts.suppliers.loading = false;
    })
  }

  uploadProduct() {
    if (!this.file || this.file.size > 2000000) {
      this.snackBar.open('Hubo un error al cargar la imagen del producto. La imagen no debe exceder los 2MB. Revise los datos e inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
      return;
    } else {
      this.alerts.adding.product = true;
      this.newProduct.isValidated = false;
      this.newProduct.userId = this.userId;
      this.newProduct.subcategoryId = parseInt(String(this.newProduct.subcategoryId));
      this.productService.addProduct(this.newProduct)
        .then(res => {
          this.productService.addProductImage(res.id, this.file)
            .then(() => {
              console.log('PRODUCT', this.newProduct);
              this.alerts.adding.product = false;
              // this.saveImage(res.id);
              this.uploadSupplierProduct(res.id);
            })
            .catch(() => {
              this.snackBar.open('Hubo un error al cargar la imagen del producto. Revise los datos e inténtelo nuevamente.', '', {
                duration: 5000,
                verticalPosition: 'top', panelClass: ['snack-bar-error']

              });
              this.alerts.adding.product = false;
            });
        })
        .catch(() => {
          this.snackBar.open('Hubo un error al cargar el producto. Revise los datos e inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top', panelClass: ['snack-bar-error']

          });
        });
    }
  }

  private uploadSupplierProduct(productID: number) {
    this.alerts.adding.product = true;
    console.log('SUPPLIER PRODUCT', this.newSupplierProduct);
    this.newSupplierProduct.productId = productID;
    this.userAuthService.loggedUser.then(u => {
      this.newSupplierProduct.userId   = u.id;
      this.newSupplierProduct.supplierId = parseInt(String(this.newSupplierProduct.supplierId));
      this.supplierProductService.addSupplierProduct(this.newSupplierProduct)
        .then(res => {

          this.alerts.adding.supplierProduct = false;
          this.snackBar.open('El producto fue agregado correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top', panelClass: ['snack-bar-success']

          });
          this.resetUploadProduct();
          this.alerts.adding.product = false;

        })
        .catch(error => {
          this.snackBar.open('Hubo un error al cargar el producto. Revise los datos e inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top', panelClass: ['snack-bar-error']

          });
          this.alerts.adding.supplierProduct = false;
        });
    });

  }

  private initializeEmptyObjects() {
    this.newReportSupplier = Report.empty();
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

  saveImage(productId: number) {
    if (this.formGroup.valid && this.file) {
      this.productService.addProductImage(productId, this.file)
        .then(() => {
        })
        .catch(() => {
          this.snackBar.open('Hubo un error al guardar la imagen del producto. La imagen no debe exceder los 2MB. Revise los datos e inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top', panelClass: ['snack-bar-error']

          });
        });
    }
  }

  imageSelect(event) {
    this.file = event.srcElement.files[0];
  };

  public openReportModal(template: TemplateRef<any>) {
    this.newReportSupplier = Report.empty();
    this.createReportFormControl();
    this.modalRef = this.modalService.show(template);

  }

  private createReportFormControl() {
    this.reportFormGroup = this.fb.group({
      description: ['', Validators.required],
    }, {})
  }

  public sendReport() {
    this.alerts.adding.report = true;
    this.newReportSupplier.userId = this.userId;
    this.reportService.addReport(this.newReportSupplier)
      .then(res => {
        this.alerts.adding.report = false;
        this.modalRef.hide();
        this.snackBar.open('El reporte fué generado con éxito.', '', {
          duration: 5000,
          verticalPosition: 'top', panelClass: ['snack-bar-success']

        });
      })
      .catch(() => {
        this.snackBar.open('Hubo un error al generar el reporte.', '', {
          duration: 5000,
          verticalPosition: 'top', panelClass: ['snack-bar-error']

        });
      });

    this.alerts.adding.report = false;
  }

  resetModal() {
    this.newReportSupplier = Report.empty();
    this.modalRef.hide();
  }
}
