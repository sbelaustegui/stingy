import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {Location} from "../../shared/models/location.model";
import {LocationService} from "../../shared/services/location.service";
import {CartService} from "../../shared/services/cart.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SubcategoryService, CategoryService, ProductService,
    SupplierService, SupplierProductService, CartProductService, LocationService,
    UserAuthService, BsModalService, CartService]
})
export class HomeComponent implements OnInit {

  public subcategories: Subcategory[];
  public searchedProducts: Product[];
  public supplierProducts: Map<number, SupplierProduct[]>;
  public suppliers: Map<number, Supplier>;
  public selectedCategoryId: number;
  public searched: boolean;
  public productName: string;
  public selectedSubcategoryId: string;
  public categories: Category[];
  public user: User;
  public currentCartId: number;  //TODO REVIEW HOW TO MANAGE MULTIPLE CARTS.

  public alerts: {
    user: {
      loaded: boolean,
      error: boolean,
    },
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
    },
    price: {
      loading: boolean,
      error: boolean,
    },
    supplierProducts: {
      empty: boolean,
      loading: boolean,
      error: boolean,
    }
  };

  modalRef: BsModalRef;
  location: Location;

  selectedSupplierProduct: SupplierProduct;
  selectedSupplierProductIndex: number;

  @ViewChild('results') el:ElementRef;

  constructor(public subcategoryService: SubcategoryService, public categoryService: CategoryService,
              public cartProductService: CartProductService, public userAuthService: UserAuthService,
              public productService: ProductService, public supplierService: SupplierService,
              public supplierProductService: SupplierProductService, public locationService: LocationService,
              public modalService: BsModalService, public cartService: CartService, private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Búsqueda de Producto | Stingy');
    this.alerts = {
      user: {
        loaded: false,
        error: false,
      },
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
      price: {
        loading: false,
        error: false,
      },
      supplierProducts: {
        empty: true,
        loading: false,
        error: false,
      },
    };
    this.location = Location.empty();
    this.getUserData();
    this.subcategories = [];
    this.searchedProducts = [];
    this.supplierProducts = new Map<number, SupplierProduct[]>();
    this.suppliers = new Map<number, Supplier>();
    this.getCategories();
  }

  /*
  GETTERS
   */

  /**
   * Gets users ids and last current location on the database.
   */
  getUserData() {
    this.userAuthService.loggedUser.then(res => {
      this.user = res;
      this.locationService.getLocationById(res.locationId).then(l => {
        this.location = l;
      });
      this.getCurrentCart();
      this.findCurrentGeoLocation();
    }).catch(() => {
      this.alerts.user.error;
    })
  }

  getCurrentCart() {
    this.cartService.getCartByUserId(this.user.id).then(res => {
        this.currentCartId = res.id;
      }
    )
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

  getSupplierProductsMap(productId: number): SupplierProduct[] {
    return this.supplierProducts.has(productId) ? this.supplierProducts.get(productId) : [];
  }

  getSupplierMap(supplierId: number): Supplier {
    return this.suppliers.has(supplierId) ?
      this.suppliers.get(supplierId) : null;
  }

  /**
   * Gets ProductSupplier array and save it in a map with productId as key. The array is sort by SupplierProduct's price.
   * @param {number} productId
   * @param {number} userId
   */
  getSupplierProducts(productId: number, userId: number) {
    this.supplierProductService.getSuppliersProductsByUserLocation(productId, userId)
      .then(res => {
          this.supplierProducts.set(productId, res.sort((n1, n2) => {
            if (n1.price > n2.price)
              return 1;
            else if (n1.price < n2.price)
              return -1;
            else
              return 0;
          })); //Add SuppliersP. to map
          res.forEach(sp => {
            this.supplierService.getSupplierById(sp.supplierId).then(s => {
              this.suppliers.set(s.id, s);
            });
          }); //Add Suppliers. to map.
          this.alerts.location.error = false;
        }
      )
      .catch(error => {
        switch (error.message) {
          case "No product for that id":
            break;
          case "No location for that user":
            this.alerts.location.error = true;
            break;
          case "No user for that id":
            this.alerts.user.error = true;
            break;
          case "Invalid Data":
            break;
        }
      })
  }

  /*
  FUNCTIONAL
 */

  search() {
    if (this.productName && this.productName !== '' && this.selectedSubcategoryId && this.location.id) {
      this.productService.searchProduct({
        name: this.productName,
        subcategoryId: this.selectedSubcategoryId ? parseInt(this.selectedSubcategoryId) : 0
      }).then(res => {
        this.searchedProducts = res;
        this.searched = true;
        this.supplierProducts.clear();
        this.suppliers.clear();
        this.searchedProducts.forEach(p => {
          this.getSupplierProducts(p.id, this.user.id);
        });
        //TODO agregar loader y mensaje de error
        this.alerts.search.error = false;
        this.alerts.search.loading = false;
        setTimeout(() =>  this.el.nativeElement.scrollIntoView(), 1000);
      }).catch(err => {
        console.log(err);
        this.alerts.search.error = true;
        this.alerts.search.loading = false;
      })
    }else {
      if(!this.location.id){
      }
    }
  }

  addToCart(productId: number) {
    if (this.supplierProducts.has(productId)) {
      this.supplierProducts.get(productId).forEach(sp => {
        this.cartProductService.addCartProduct(new CartProduct(this.currentCartId, sp.id));
      })
    }
  }

  public findCurrentGeoLocation() {
    try {
      this.alerts.location.loading = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.location.latitude = position.coords.latitude;
        this.location.longitude = position.coords.longitude;
        //TODO mostrar un toast o snackbar que se actualizo la location
        this.locationService.updateLocation(this.location).then(this.modalRef ? this.modalRef.hide : undefined);
      });
      this.alerts.location.loading = false;
      this.alerts.location.error = false;
    }
    catch (e) {
      this.alerts.location.error = true;
    }
  }

  public openModal(template: TemplateRef<any>, supplierProduct?, supplierProductIndex?) {
    if(supplierProduct){
      this.selectedSupplierProduct = supplierProduct;
      this.selectedSupplierProductIndex = supplierProductIndex;
    }
    this.modalRef = this.modalService.show(template);
  }

  priceUpdate(){
    this.alerts.price.loading = true;
    this.supplierProductService.addSupplierProduct(new SupplierProduct(this.selectedSupplierProduct.supplierId, this.selectedSupplierProduct.productId, this.selectedSupplierProduct.price))
        .then(res => {
          this.supplierProducts.get(res.productId)[this.selectedSupplierProductIndex] = res;
          this.alerts.price.loading = false;
          this.alerts.price.error = false;
          this.resetModal();
        }).catch(() => {
          this.alerts.price.loading = false;
          this.alerts.price.error = true;
        });
  }

  resetModal() {
    this.modalRef.hide();
  }

}
