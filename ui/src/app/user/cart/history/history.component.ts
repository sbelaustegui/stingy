import {Component, OnInit} from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {UserAuthService} from "../../../shared/auth/user/user-auth.service";
import {Title} from "@angular/platform-browser";
import {Cart} from "../../../shared/models/cart.model";
import {CartProductService} from "../../../shared/services/cartProduct.service";
import {SupplierProductService} from "../../../shared/services/supplierProduct.service";
import {SupplierProductCart} from "../../../shared/models/supplier-product-cart.model";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [CartService, CartProductService, SupplierProductService]
})
export class HistoryComponent implements OnInit {

  public userId: number;
  public alerts: {
    carts: {
      loading: boolean,
    },
    supplierProducts: {
      loading: boolean,
    },
    user: {
      loading: boolean;
    },
  };
  public carts: Cart[];
  public supplierProducts: Map<number, SupplierProductCart[]>;

  constructor(public cartService: CartService, public supplierProductService: SupplierProductService, public cartProductService: CartProductService, public authService: UserAuthService, private titleService: Title, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.titleService.setTitle('Historial Carritos | Stingy');
    this.alerts = {
      carts: {
        loading: true,
      },
      supplierProducts: {
        loading: true,
      },
      user: {
        loading: true
      },
    };
    this.carts = [];
    this.supplierProducts = new Map<number, SupplierProductCart[]>();
    this.getUserId();
  }

  private getUserId() {
    this.authService.loggedUser.then(res => {
      this.userId = res.id;
      this.getCarts();
      this.alerts.user.loading = false;
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener el usuario, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top', panelClass: ['snack-bar-error']

      });
      this.alerts.user.loading = false;
    })
  }

  getCarts() {
    this.cartService.getCartsByUserId(this.userId)
      .then(res => {
        res.forEach(cart => {
          if (!cart.current) {
            this.carts.push(Cart.from(cart));
          }
        });
        this.alerts.carts.loading = false;
        this.getSupplierProducts();
      })
      .catch(() => {
        this.snackBar.open('Hubo un error al obtener los carritos, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top', panelClass: ['snack-bar-error']

        });
        this.alerts.carts.loading = false;
      })
  }

  private getSupplierProducts() {
    this.carts.forEach((cart, index) => {
      this.supplierProductService.getSupplierProductsByCartId(cart.id)
        .then(res => {
          this.supplierProducts.set(cart.id, res);
          if (index == this.carts.length - 1) {
            this.alerts.supplierProducts.loading = false;
          }
        })
        .catch(() => {
          this.snackBar.open('Hubo un error al obtener los proveedores, por favor inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top', panelClass: ['snack-bar-error']

          });
          this.alerts.supplierProducts.loading = false;
          return;
        })
    });
  }

  cartsIds(): Array<number> {
    return Array.from(this.supplierProducts.keys());
  }

  getCartById(id): Cart {
    return this.carts.find(cart => cart.id == id);
  }
}
