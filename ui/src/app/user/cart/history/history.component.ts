import { Component, OnInit } from '@angular/core';
import {CartService} from "../../../shared/services/cart.service";
import {UserAuthService} from "../../../shared/auth/user/user-auth.service";
import {Title} from "@angular/platform-browser";
import {Cart} from "../../../shared/models/cart.model";
import {CartProductService} from "../../../shared/services/cartProduct.service";
import {SupplierProductService} from "../../../shared/services/supplierProduct.service";
import {SupplierProductCart} from "../../../shared/models/supplier-product-cart.model";

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
      error: boolean,
      loading: boolean,
    },
    supplierProducts:{
      error: boolean,
      loading: boolean,
    },
    user: {
      error: boolean;
      loading: boolean;
    },
  };
  public carts: Cart[];
  public supplierProducts: Map<number, SupplierProductCart[]>;

  constructor(public cartService: CartService, public supplierProductService: SupplierProductService, public cartProductService: CartProductService, public authService: UserAuthService, private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle('Historial Carritos | Stingy');
    this.alerts = {
      carts: {
        error: false,
        loading: true,
      },
      supplierProducts:{
        error: false,
        loading: true,
      },
      user: {
        error: false,
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
      this.alerts.user.error = false;
    }).catch(() => {
      this.alerts.user.error = true;
      this.alerts.user.loading = false;
    })
  }

  getCarts(){
    this.cartService.getCartsByUserId(this.userId)
      .then(res => {
        res.forEach(cart => {
          if(!cart.current) {
            this.carts.push(Cart.from(cart));
          }
        });
        this.alerts.carts.loading = false;
        this.alerts.carts.error = false;
        this.getSupplierProducts();
      })
      .catch(() => {
        this.alerts.carts.error = true;
        this.alerts.carts.loading = false;
      })
  }

  private getSupplierProducts() {
    this.carts.forEach((cart, index) => {
      this.supplierProductService.getSupplierProductsByCartId(cart.id)
        .then(res => {
          this.supplierProducts.set(cart.id, res);
          if(index == this.carts.length-1){
            this.alerts.supplierProducts.error = false;
            this.alerts.supplierProducts.loading = false;
          }
        })
        .catch(() => {
          this.alerts.supplierProducts.error = true;
          this.alerts.supplierProducts.loading = false;
          return;
        })
    });
  }

  cartsIds(): Array<number>{
    return Array.from(this.supplierProducts.keys());
  }

  getCartById(id): Cart {
    return this.carts.find(cart => cart.id == id);
  }
}
