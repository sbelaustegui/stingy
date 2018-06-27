///<reference path="../../../../node_modules/@angular/router/src/router.d.ts"/>
import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
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
import {CartProduct} from "../../shared/models/cartProduct.model";

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
  public productsPage: number = 1;
  public alerts: {
    details: {
      loading: boolean,
      error: boolean,
    },
    cartBags: {
      error: boolean,
      loading: boolean,
      deletingError: boolean,
      deletingProducts: boolean,
    },
    cart: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
    },
    user: {
      error: boolean;
      loading: boolean;
    },
    success: boolean
  };

  public cartBagIndex: number;
  public cartBagProductToDelete: CartBagProduct;
  private cartProductsToDelete: number[]; //CartProduct id
  public cartBagProductModal: CartBagProduct;

  modalRef: BsModalRef;

  constructor(public cartService: CartService, public cartProductService: CartProductService, public authService: UserAuthService,
              public productService: ProductService, public supplierService: SupplierService,
              public supplierProductService: SupplierProductService,
              public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Tu carrito | Stingy');
    this.alerts = {
      details: {
        loading: false,
        error: false,
      },
      cartBags: {
        error: false,
        loading: false,
        deletingError: false,
        deletingProducts: false,
      },
      cart: {
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
      },
      user: {
        error: false,
        loading: true
      },
      success: false
    };

    this.cartBagIndex = -1;
    this.cartBagProductToDelete = undefined;
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
      this.alerts.user.error = false;
    }).catch(() => {
      this.alerts.user.error = true;
      this.alerts.user.loading = false;
      setTimeout(() => this.alerts.user.error = false, 5000)
    })
  }

  public getCurrentCart(userId: number) {
    this.cartService.getCartByUserId(userId)
      .then(res => {
        this.alerts.cart.loading = true;
        this.currentCart = res;
        this.alerts.cart.loading = false;
        this.alerts.cart.error = false;
        this.getCurrentCartBags();
      })
      .catch(err => {
        console.log(err);
        this.alerts.cart.error = true;
        this.alerts.cart.loading = false;
      })
  }

  private getCurrentCartBags() {
    this.cartService.getCartBagsById(this.currentCart.id)
      .then(res => {
        this.alerts.cartBags.loading = true;
        this.cartBags = res;
        this.saveSuppliersAndTotalPrice();
        this.cartBags = this.sortCartBagByTotalPrice();
        this.alerts.cartBags.loading = false;
      })
      .catch(error => {
        setTimeout(() => {
          this.alerts.cartBags.error = false;
        }, 2500);
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
        .catch(error => {
          //todo supplier
        })
    });
  }

  // EXTERNAL METHODS
  goToHistory() {
    this.router.navigate(['user/cart/history']);
  }

  //MODAL METHODS

  deleteProduct(cartBagProductIndex: number, cartBagIndex: number) {

    this.alerts.cartBags.deletingProducts = true;
    // this.cartProductsToDelete.push(this.cartBags[cartBagIndex].products[cartBagProductIndex].cartProductId);
    this.cartBags[cartBagIndex].products.splice(cartBagProductIndex, 1);
    // this.cartProductService.deleteCartProductByCartIdAndSPId( //TODO SEBASTIAN
    //   .then(res => {
    //     this.alerts.cartBags.deletingProducts = false;
    //     this.modalRef.hide();
    //     this.alerts.success = true;
    //     setTimeout(() => {
    //       this.alerts.success = false;
    //     }, 2500);
    //   })
    //   .catch(() => {
    //       this.alerts.cartBags.deletingProducts = false;
    //       this.alerts.cartBags.deletingError = true;
    //       setTimeout(() => {
    //         this.alerts.cartBags.deletingError = false;
    //       }, 5000);
    //     }
    //   )
  }

  openProductModal(template: TemplateRef<any>, cartBagProduct: CartBagProduct) {
    // this.cartBagProductModal = CartBagProduct.from(cartBagProduct);
    this.cartBagProductModal = cartBagProduct;
    this.modalRef = this.modalService.show(template);
  }

  openProductDeleteModal(template: TemplateRef<any>, cartBagIndex: number, cartBagProduct: CartBagProduct) {
    this.cartBagIndex = cartBagIndex;
    this.cartBagProductToDelete = cartBagProduct;
    this.modalRef = this.modalService.show(template);
  }

  resetModal(reference: string) {
    this.modalRef.hide();
    switch (reference.toUpperCase()) {
      case "PRODUCT":
        this.cartBagProductModal = CartBagProduct.empty();
        break;
      case "PRODUCTDELETE":
        this.cartBagIndex = -1;
        this.cartBagProductToDelete = undefined;
        break;
    }
  }
}
