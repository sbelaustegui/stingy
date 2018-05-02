import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {BsModalService} from "ngx-bootstrap/modal";
import {ProductService} from "../../shared/services/product.service";
import {Product} from "../../shared/models/product.model";
import {Subcategory} from "../../shared/models/subcategory.model";
import {Category} from "../../shared/models/category.model";
import {SubcategoryService} from "../../shared/services/subcategory.service";
import {CategoryService} from "../../shared/services/category.service";
import {SupplierService} from "../../shared/services/supplier.service";
import {Supplier} from "../../shared/models/supplier.model";


@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss'],
  providers: [ProductService, SubcategoryService, CategoryService, SupplierService]
})
export class UploadProductComponent implements OnInit {

  //
  // public productFormGroup: FormGroup;
  // public newProduct: Product;
  // public productToDelete: Product;
  // public productIndexToDelete: number;
  // public productIndexUpdate: number;
  // public products: Product[];
  // public alerts: {
  //   addProduct: {
  //     error: boolean,
  //     loading: boolean,
  //   },
  //   products: {
  //     error: boolean,
  //     loading: boolean,
  //     deleting: boolean,
  //     deletingError: boolean,
  //   },
  // };
  // modalRef: BsModalRef;
  //
  // constructor(public fb: FormBuilder, public productService: ProductService, public router: Router, private titleService: Title, private modalService: BsModalService) {
  // }
  //
  // ngOnInit() {
  //   this.titleService.setTitle('AM Products | Stingy');
  //   this.newProduct = Product.empty();
  //   this.alerts = {
  //     addProduct: {
  //       error: false,
  //       loading: false,
  //     },
  //     products: {
  //       error: false,
  //       loading: true,
  //       deleting: false,
  //       deletingError: false
  //     },
  //   };
  //   this.createProductFormControls();
  //   this.getProducts();
  // }
  //
  // getProducts() {
  //   this.productService.products.then(res => {
  //     this.products = res;
  //     this.alerts.products.error = false;
  //     this.alerts.products.loading = false;
  //   }).catch(err => {
  //     //TODO mostrar en el front mensaje de error
  //     this.alerts.products.error = true;
  //     this.alerts.products.loading = false;
  //   })
  // }
  //
  //
  // uploadProduct() {
  //   this.alerts.addProduct.loading = true;
  //   if(this.newProduct.id) {
  //     this.newProduct.id = parseInt(String(this.newProduct.id));
  //     this.productService.updateProduct(this.newProduct).then(res => {
  //       this.products[this.productIndexUpdate] = res;
  //       this.alerts.addProduct.loading = false;
  //       this.alerts.addProduct.error = false;
  //       this.newProduct = Product.empty();
  //       this.productFormGroup.reset();
  //       this.modalRef.hide();
  //     }).catch(() => {
  //       this.alerts.addProduct.loading = false;
  //       this.alerts.addProduct.error = true;
  //     })
  //   } else {
  //     this.newProduct.id = parseInt(String(this.newProduct.id));
  //     this.productService.addProduct(this.newProduct).then(res => {
  //       this.products.push(res);
  //       this.alerts.addProduct.loading = false;
  //       this.alerts.addProduct.error = false;
  //       this.newProduct = Product.empty();
  //       this.productFormGroup.reset();
  //       this.modalRef.hide();
  //     }).catch(() => {
  //       this.alerts.addProduct.loading = false;
  //       this.alerts.addProduct.error = true;
  //     })
  //   }
  // }
  //
  // private createProductFormControls() {
  //   this.productFormGroup = this.fb.group({
  //     name: ['', Validators.required],
  //     categoryId: [Number, Validators.required],
  //   })
  // }
  //
  // openProductModal(template: TemplateRef<any>, product?) {
  //   if(product) this.newProduct = product;
  //   this.modalRef = this.modalService.show(template);
  // }
  //
  // resetDeleteModal(){
  //   this.productIndexToDelete = -1;
  //   this.productToDelete = undefined;
  // }

  public formGroup: FormGroup;
  public newProduct: Product;
  public uploadProductError: boolean;
  public addingProduct: boolean;
  public selectedCategoryId: number;
  public categories: Category[];
  public selectedSubcategoryId: number;
  public subcategories: Subcategory[];
  public selectedSupplierId: number;
  public suppliers: Supplier[];
  public alerts: {
    subcategories:{
      loading: boolean,
      error: boolean,
    },
    categories:{
      loading: boolean,
      error: boolean,
    },
    suppliers:{
      loading: boolean,
      error: boolean,
    }
  };


  constructor(public fb: FormBuilder, public productService: ProductService, public router: Router, private titleService: Title,
              private subcategoryService: SubcategoryService, private categoryService: CategoryService,
              private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Carga de Producto | Stingy');
    this.newProduct = Product.empty();
    this.addingProduct = false;
    this.uploadProductError = false;
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
      suppliers:{
        loading: false,
        error: false,
      }
    };
  }


  uploadProduct() {
    this.addingProduct = true;
    if(this.selectedSupplierId == null && this.selectedSubcategoryId == null){
      this.uploadProductError = true;
      this.addingProduct = false;
      return;
    }
    this.newProduct.isValidated = false;
    this.newProduct.subcategoryId = this.selectedSubcategoryId;
    this.newProduct.supplierId = this.selectedSupplierId;
    this.productService.addProduct(this.newProduct).then( () => {
      this.addingProduct = false;
      this.uploadProductError = false;
    }).catch(() => {
      this.uploadProductError = true;
      this.addingProduct = false;
    })

  }

  private createFormControls() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required,Validators.min(0)]],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required,]],
    }, {
    })
  }

  getSubcategories(){
    this.subcategoryService.getSubcategoryByCategoryId(this.selectedCategoryId).then(res => {
      this.subcategories = res;
      this.alerts.subcategories.error = false;
      this.alerts.subcategories.loading = false;
    }).catch(err => {
      console.log(err);
      this.alerts.subcategories.error = true;
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories(){
    this.categoryService.categories.then(res => {
      this.categories = res;
      this.alerts.categories.error = false;
      this.alerts.categories.loading = false;
    }).catch(err => {
      console.log(err);
      this.alerts.categories.error = true;
      this.alerts.categories.loading = false;
    })
  }

  getSuppliers(){
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

}
