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
import {MatSnackBar} from "@angular/material";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SubcategoryService, CategoryService, ProductService,
    SupplierService, SupplierProductService, CartProductService, LocationService,
    UserAuthService, BsModalService, CartService]
})
export class HomeComponent implements OnInit {
  myAnimation: any;

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
  public productsAdded: Map<number, boolean>;
  public currentCartId: number;  //TODO REVIEW HOW TO MANAGE MULTIPLE CARTS.

  public alerts: {
    user: {
      loaded: boolean,
    },
    subcategories: {
      loading: boolean,
    },
    categories: {
      loading: boolean,
    },
    search: {
      loading: boolean,
    },
    location: {
      loading: boolean,
    },
    price: {
      loading: boolean,
    },
    supplierProducts: {
      empty: boolean,
      loading: boolean,
    }
  };

  modalRef: BsModalRef;
  location: Location;

  selectedSupplierProduct: SupplierProduct;
  selectedSupplierProductIndex: number;

  @ViewChild('results') el: ElementRef;

  constructor(public subcategoryService: SubcategoryService, public categoryService: CategoryService,
              public cartProductService: CartProductService, public userAuthService: UserAuthService,
              public productService: ProductService, public supplierService: SupplierService, public userService: UserService,
              public supplierProductService: SupplierProductService, public locationService: LocationService,
              public modalService: BsModalService, public cartService: CartService, private titleService: Title, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.titleService.setTitle('Búsqueda de Producto | Stingy');
    this.alerts = {
      user: {
        loaded: false,
      },
      subcategories: {
        loading: false,
      },
      categories: {
        loading: true,
      },
      search: {
        loading: false,
      },
      location: {
        loading: false,
      },
      price: {
        loading: false,
      },
      supplierProducts: {
        empty: true,
        loading: false,
      },
    };
    this.location = Location.empty();
    this.getUserData();
    this.subcategories = [];
    this.searchedProducts = [];
    this.supplierProducts = new Map<number, SupplierProduct[]>();
    this.suppliers = new Map<number, Supplier>();
    this.getCategories();
    this.productsAdded = new Map<number, boolean>();
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
      }).catch(() => this.findCurrentGeoLocation());
      this.getCurrentCart();
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener la información del usuario loggeado, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snack-bar-error']
      });
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
      this.alerts.subcategories.loading = false;
    }).catch(err => {
      this.snackBar.open('Hubo un error al obtener las subcategorias, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snack-bar-error']
      });
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories() {
    this.categoryService.categories.then(res => {
      this.categories = res;
      this.alerts.categories.loading = false;
    }).catch(err => {
      this.snackBar.open('Hubo un error al obtener las categorias, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snack-bar-error']
      });
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
        }
      )
      .catch(error => {
        switch (error.message) {
          case "No product for that id":
            this.snackBar.open('Hubo un error al obtener los productos. No se encontraron productos para ese id.', '', {
              duration: 5000,
              verticalPosition: 'top'
              , panelClass: ['snack-bar-error']
            });
            break;
          case "No location for that user":
            this.snackBar.open('Hubo un error al obtener los productos. El usuario no posee una ubicación seteada previamente.', '', {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['snack-bar-error']

            });

            break;
          case "No user for that id":
            this.snackBar.open('Hubo un error al obtener los productos. No se encontró usuario para ese id.', '', {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['snack-bar-error']

            });
            break;
          case "Invalid Data":
            this.snackBar.open('Hubo un error al obtener los productos. Por favor inténtelo nuevamente mas tarde.', '', {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['snack-bar-error']

            });
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
        //TODO agregar loader
        this.alerts.search.loading = false;
        setTimeout(() => this.el.nativeElement.scrollIntoView(), 1000);
      }).catch(err => {
        this.snackBar.open('Hubo un error al obtener los resultados, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error']
        });
        this.alerts.search.loading = false;
      })
    } else {
      if (!this.location.id) {
        // TODO ???
      }
    }
  }

  addToCart(productId: number) {
    if (this.supplierProducts.has(productId)) {
      this.supplierProducts.get(productId).forEach(sp => {
        this.cartProductService.addCartProduct(new CartProduct(this.currentCartId, sp.id))
          .then(res => {
            this.snackBar.open('El producto se agregó con éxito.', '', {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['snack-bar-success']
            })
        }).catch(err => {
          this.snackBar.open('Hubo un error al agregar el product, por favor inténtelo nuevamente. Revise que no este ya agregado.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-error'],

          });
        })
      })
    }
  }

  findCurrentGeoLocation() {
    try {
      this.alerts.location.loading = true;
      navigator.geolocation.getCurrentPosition(position => {
        this.location.latitude = position.coords.latitude;
        this.location.longitude = position.coords.longitude;
        this.resetModal();
        this.locationService.addUserLocation(this.location, this.user.id)
          .then(l => {
            this.location = l;
            let newUser = {id: this.user.id, locationId: l.id};
            // this.userService.updateUser(newUser)
            //   .then(r => {
              this.snackBar.open('Su ubicación se actualizó correctamente.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['snack-bar-success'],
              });
            })
          .catch(err => {
              this.snackBar.open('Hubo un error al guardar su ubicación, por favor inténtelo nuevamente.', '', {
                duration: 5000,
                verticalPosition: 'top',
                panelClass: ['snack-bar-error'],

              });
        })
      });
      this.alerts.location.loading = false;
    } catch (e) {
      this.location = Location.empty();
      this.snackBar.open('Hubo un error al obtener su ubicación, por favor inténtelo nuevamente. Revise los permisos de su navegador.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snack-bar-error'],

      });
    }
  }

  public openModal(template: TemplateRef<any>, supplierProduct?, supplierProductIndex?) {
    if (supplierProduct) {
      this.selectedSupplierProduct = supplierProduct;
      this.selectedSupplierProductIndex = supplierProductIndex;
    }
    this.modalRef = this.modalService.show(template);
  }

  priceUpdate() {
    if (this.selectedSupplierProduct.price <= 0) {
      this.alerts.price.loading = true;
      this.supplierProductService.addSupplierProduct(new SupplierProduct(this.user.id, this.selectedSupplierProduct.supplierId, this.selectedSupplierProduct.productId, this.selectedSupplierProduct.price))
        .then(res => {
          this.supplierProducts.get(res.productId)[this.selectedSupplierProductIndex] = res;
          this.alerts.price.loading = false;
          this.resetModal();
        }).catch(() => {
        this.alerts.price.loading = false;
        this.snackBar.open('Hubo un error al actualizar el precio, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-success']

        });
      });
    } else {
      this.snackBar.open('Hubo un error al actualizar el precio, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['snack-bar-error']
      });
    }
  }

  resetModal() {
    this.modalRef.hide();
  }

  mapReading() {
    this.myAnimation = 'BOUNCE';
  }
}
