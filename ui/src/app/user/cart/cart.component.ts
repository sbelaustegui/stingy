///<reference path="../../../../node_modules/@angular/router/src/router.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {BsModalService} from "ngx-bootstrap";
import {Title} from "@angular/platform-browser";
import {CartService} from "../../shared/services/cart.service";
import {Router} from "@angular/router";
import {Cart} from "../../shared/models/cart.model";
import {CartProductService} from "../../shared/services/cartProduct.service";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {ProductService} from "../../shared/services/product.service";
import {SupplierService} from "../../shared/services/supplier.service";
import {SupplierProductService} from "../../shared/services/supplierProduct.service";
import {CartBag} from "../../shared/models/cart-bag.model";
import {CartBagProduct} from "../../shared/models/cart-bag-product";
import {Supplier} from "../../shared/models/supplier.model";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CartService, CartProductService,
    UserAuthService, ProductService, SupplierService,
    SupplierProductService]
})

export class CartComponent implements OnInit {
  public cartBags: CartBag[];
  public cartBagsPrices: Map<number, number>; // <supplierId, totalPrice>
  public suppliers: Map<number, Supplier>; // <supplierId, Supplier>

  public userId: number;
  public currentCart: Cart;
  public alerts: {
    details: {
      loading: boolean,
    },
    cartBags: {
      loading: boolean,
      deletingProducts: boolean,
    },
    cart: {
      loading: boolean,
      deleting: boolean,
    },
    user: {
      loading: boolean;
    },
  };
  private _CB_Index: number;
  private _CBP_Index: number;


  constructor(private cartService: CartService,
              private authService: UserAuthService,
              private supplierService: SupplierService,
              private router: Router,
              private cartProductService: CartProductService,
              private titleService: Title, private modalService: BsModalService, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.titleService.setTitle('Tu carrito | Stingy');
    this.alerts = {
      details: {
        loading: false,
      },
      cartBags: {
        loading: false,
        deletingProducts: false,
      },
      cart: {
        loading: true,
        deleting: false,
      },
      user: {
        loading: true
      },
    };

    this._CB_Index = -1;
    this._CBP_Index = -1;
    this.cartBags = [];
    this.cartBagsPrices = new Map<number, number>();
    this.suppliers = new Map<number, Supplier>();
    this.getUserId();
  }


  //GETTERS

  private getUserId() {
    this.authService.loggedUser.then(res => {
      this.userId = res.id;
      this.getCurrentCart(res.id);
      this.alerts.user.loading = false;
    }).catch(() => {
      this.alerts.user.loading = false;
      this.snackBar.open('Hubo un error al obtener el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
    })
  }

  public getCurrentCart(userId: number) {
    this.cartService.getCartByUserId(userId)
      .then(res => {
        this.alerts.cart.loading = true;
        this.currentCart = res;
        this.alerts.cart.loading = false;
        this.getCurrentCartBags();
      })
      .catch(() => {
        this.snackBar.open('Hubo un error al obtener el carrito, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top', panelClass: ['snack-bar-error']

        });
        this.alerts.cart.loading = false;
      })
  }

  private getCurrentCartBags() {
    this.alerts.cartBags.loading = true;
    this.cartService.getCartBagsById(this.currentCart.id)
      .then(res => {
        console.log('CARTBAGS', res);
        this.cartBags = res;
        this.saveSuppliersAndTotalPrice();
        this.cartBags = this.sortCartBagByTotalPrice();
        this.alerts.cartBags.loading = false;
      })
      .catch(() => {
        this.snackBar.open('Hubo un error al obtener el carrito, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top', panelClass: ['snack-bar-error']

        });
        this.alerts.cartBags.loading = false;
      })
  }

  public getSupplierNameBySupId(supplierId: number): string {
    return this.suppliers.has(supplierId) ? this.suppliers.get(supplierId).name : "NO SUPPLIER";
  }

  public getCartBagTotalPriceBySupId(supplierId: number): number {
    return this.cartBagsPrices.has(supplierId) ? this.cartBagsPrices.get(supplierId) : -1;
  }

  //INTERNAL METHODS

  public sortCartBagByTotalPrice(): CartBag[] {

    return this.cartBags.sort((cB1, cB2) => {
      if (!this.cartBagsPrices.has(cB1.supplierId)
        || !this.cartBagsPrices.has(cB2.supplierId))
        return 0;

      let cB1_totalPrice = this.cartBagsPrices.get(cB1.supplierId);
      let cB2_totalPrice = this.cartBagsPrices.get(cB2.supplierId);

      if (cB1_totalPrice > cB2_totalPrice)
        return 1;
      else
        return -1;
    });
  }

  public calculateTotalPrice(products: CartBagProduct[], supplierId: number): number {
    let result = 0;
    products.forEach(p => {
      result += p.supplierProductPrice;
    });
    this.cartBagsPrices.set(supplierId, result);
    return result;
  }

  private saveSuppliersAndTotalPrice() {
    this.cartBags.forEach(cb => {
      this.calculateTotalPrice(cb.products, cb.supplierId);
      this.supplierService.getSupplierById(cb.supplierId)
        .then(res => {
          this.suppliers.set(res.id, res);
        })
        .catch(() => {
          this.snackBar.open('Hubo un error al obtener el proveedor, por favor inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top', panelClass: ['snack-bar-error']

          });
          //todo supplier
        })
    });
  }

  // EXTERNAL METHODS
  goToHistory() {
    this.router.navigate(['user/cart/history']);
  }

  deleteProduct(cartBagProductToDelete: CartBagProduct) {
    console.log('PRODUCT TO DELETE', cartBagProductToDelete);
    this.cartProductService.deleteCartProduct(this.currentCart.id, cartBagProductToDelete.supplierProductId)
      .then(res => {
        this.getCurrentCart(this.userId);
          this.snackBar.open('El producto fue eliminado correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-success']
          });
      })
      .catch(() => {
        this.snackBar.open('Hubo un error al eliminar el producto, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error']
        });
      })
  }

  finishCart() {
    this.cartService.cartFinish(this.currentCart.id).then(res => {
      this.getCurrentCart(this.userId);
    })
  }
}
