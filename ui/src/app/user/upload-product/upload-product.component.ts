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


@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss'],
  providers: [ProductService, SubcategoryService, CategoryService, SupplierService, UserAuthService]
})
export class UploadProductComponent implements OnInit {

  public formGroup: FormGroup;
  public userId: number;
  public newProduct: Product;
  public uploadProductError: boolean;
  public addingProduct: boolean;
  public selectedCategoryId: number;
  public categories: Category[];
  public subcategories: Subcategory[];
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
              private supplierService: SupplierService, private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Carga de Producto | Stingy');
    this.newProduct = Product.empty();
    this.addingProduct = false;
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
      suppliers:{
        loading: false,
        error: false,
      }
    };
  }


  uploadProduct() {
    this.addingProduct = true;
    this.newProduct.isValidated = false;
    this.newProduct.userId = this.userId;
    this.newProduct.subcategoryId = parseInt(String(this.newProduct.subcategoryId));
    this.newProduct.supplierId = parseInt(String(this.newProduct.supplierId));
    this.productService.addProduct(this.newProduct).then( () => {
      this.addingProduct = false;
      this.uploadProductError = false;
      this.resetUploadProduct();
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
      subcategoryId: [-1, [Validators.required,Validators.min(0)]],
      supplierId: [-1, [Validators.required,Validators.min(0)]],
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

  resetUploadProduct(){
    this.formGroup.reset();
    this.newProduct = Product.empty();
    this.selectedCategoryId = -1;
  }

}
