import {Component, OnInit, TemplateRef} from '@angular/core';
import {Subcategory} from "../../shared/models/subcategory.model";
import {SubcategoryService} from "../../shared/services/subcategory.service";
import {Category} from "../../shared/models/category.model";
import {CategoryService} from "../../shared/services/category.service";
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../shared/services/product.service";
import {Product} from "../../shared/models/product.model";
import {Supplier} from "../../shared/models/supplier.model";
import {SupplierService} from "../../shared/services/supplier.service";
import {CartProductService} from "../../shared/services/cartProduct.service";
import {CartProduct} from "../../shared/models/cartProduct.model";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {BsModalRef} from "ngx-bootstrap/modal/bs-modal-ref.service";
import {BsModalService} from "ngx-bootstrap";
import {SupplierProduct} from "../../shared/models/supplier-product.model";
import {SupplierProductService} from "../../shared/services/supplierProduct.service";
import {User} from "../../shared/models/user.model";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SubcategoryService, CategoryService, ProductService,
    SupplierService, SupplierProductService, CartProductService,
    UserAuthService, BsModalService]
})
export class HomeComponent implements OnInit {

  public subcategories: Subcategory[];
  public searchedProducts: Product[];
  // public productsSuppliers: Map<number, Supplier>;
  public supplierProducts: Map<number, SupplierProduct>;
  public suppliersId: number[];
  public selectedCategoryId: number;
  public searched: boolean;
  public productName: string;
  public selectedSubcategoryId: string;
  public categories: Category[];
  public user: User;


  public alerts: {
    subcategories: {
      loading: boolean,
      error: boolean,
    },
    categories: {
      loading: boolean,
      error: boolean,
    },
    search: {
      loading: boolean,
      error: boolean,
    },
    location: {
      loading: boolean,
      error: boolean,
    }
  };

  modalRef: BsModalRef;
  latitude: number;
  longitude: number;

  constructor(public subcategoryService: SubcategoryService, public categoryService: CategoryService,
              public cartProductService: CartProductService, public userAuthService: UserAuthService,
              public productService: ProductService, public suppliersService: SupplierService,
              public supplierProductService: SupplierProductService,
              public modalService: BsModalService,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Búsqueda de Producto | Stingy');
    this.alerts = {
      subcategories: {
        loading: false,
        error: false,
      },
      categories: {
        loading: true,
        error: false,
      },
      search: {
        loading: false,
        error: false,
      },
      location: {
        loading: false,
        error: false,
      },
    };
    this.getUserData();
    this.subcategories = [];
    this.searchedProducts = [];
    // this.productsSuppliers = new Map<number, Supplier>();
    this.supplierProducts = new Map<number, SupplierProduct>();
    this.getCategories();
  }

  getSubcategories() {
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

  getCategories() {
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

  search() {
    if (this.productName && this.productName !== '' && this.selectedSubcategoryId) {
      this.productService.searchProduct({
        name: this.productName,
        subcategoryId: this.selectedSubcategoryId ? parseInt(this.selectedSubcategoryId) : 0
      }).then(res => {
        this.searchedProducts = res;
        this.searched = true;
        this.searchedProducts.forEach(p => {
          // this.getProductSupplier(p.id, p.supplierId)
        });
        //TODO agregar loader y mensaje de error
        this.alerts.search.error = false;
        this.alerts.search.loading = false;
      }).catch(err => {
        console.log(err);
        this.alerts.search.error = true;
        this.alerts.search.loading = false;
      })
    }
  }

  // getProductSupplier(productId: number, supplierId: number) {
  //   this.suppliersService.getSupplierById(supplierId).then(res => {
  //     this.productsSuppliers.set(productId, res);
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }


  addToCart(supplierIdProduct: number) {
    // this.cartProductService.addCartProduct(new CartProduct(this.user.id, productId));
  }

  /**
   * Gets users ids and last current location loaded at the database.
   */
  private getUserData() {
    this.userAuthService.loggedUser.then(res => {
      this.user = res;
      // TODO SEBASTIAN SERVICE AND ROUTES!
      // this.locationService.getById(res.idLocation).then( loc => {
      //   this.location = loc;
      // })
    }).catch(() => {
      //TODO user dont logged errors
    })
  }

  public findCurrentGeoLocation() {
    try {
      this.alerts.location.loading = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        //TODO SEBASTIAN UPDATE USER LOCATION BY LOCATION SERVICE
      });
      this.alerts.location.loading = false;
      this.alerts.location.error = false;
    }
    catch (e) {
      this.alerts.location.error = true;
    }
  }

  public openLocationModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  resetModal() {
    this.modalRef.hide();
  }

  private getSupplierByLocation(supplier: number) {
    this.supplierProductService.getSuppliersProductsByUserLocation().then(res => {
        for (var s in res) {
          // this.supplierProducts.set() TODO --> THINK STRUCTURE TO SAVE AND SHOW PRODUCTS WITH SUPPLIER_PRODUCTS DATA.
        }
      }
    )
  }
}
