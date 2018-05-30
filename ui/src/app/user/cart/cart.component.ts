import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Title} from "@angular/platform-browser";
import {CartService} from "../../shared/services/cart.service";
import {Router} from "@angular/router";
import {Cart} from "../../shared/models/cart.model";
import {CartProductService} from "../../shared/services/cartProduct.service";
import {UserService} from "../../shared/services/user.service";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {ProductService} from "../../shared/services/product.service";
import {SupplierService} from "../../shared/services/supplier.service";
import {CartBag} from "../../shared/models/cart-bag.model";
import {SupplierProductService} from "../../shared/services/supplierProduct.service";
import {SupplierProduct} from "../../shared/models/supplier-product.model";
import {Product} from "../../shared/models/product.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CartService, CartProductService, UserService,
    UserAuthService, ProductService, SupplierService,
    SupplierProductService]
})

export class CartComponent implements OnInit {

  public currentCart: Cart;
  public cartBags: CartBag[];
  public productsPage: number = 1;
  public alerts: {
    cartBags: {
      check: boolean,
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
  public productToDelete: Product;

  public supProdAux: SupplierProduct;

  modalRef: BsModalRef;

  constructor(public cartService: CartService, public cartProductService: CartProductService,
              public userService: UserService, public authService: UserAuthService,
              public productService: ProductService, public supplierService: SupplierService,
              public supplierProductService: SupplierProductService,
              public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Tu carrito | Stingy');
    this.alerts = {
      cartBags: {
        check: true,
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

    this.cartBags = [];
    this.cartBagIndex = -1;
    this.productToDelete = undefined;
    this.getUser();
  }

  getUser() {
    this.authService.loggedUser.then(res => {
      this.getCurrentCart(res.id);
      this.alerts.user.loading = false;
      this.alerts.user.error = false;
    }).catch(() => {
      this.alerts.user.error = true;
      this.alerts.user.loading = false;
      setTimeout(() => this.alerts.user.error = false, 5000)
    })
  }

  getCurrentCart(userId: number) {
    this.cartService.getCartByUserId(userId).then(res => { //TODO GET CURRENT CART BY DATE OR BOOLEAN
        this.currentCart = res;
        this.alerts.cart.loading = false;
        this.alerts.cart.error = false;
        this.getCartProducts();
      }
    ).catch(err => {
      console.log(err);
      this.alerts.cart.error = true;
      this.alerts.cart.loading = false;
    })

  }

  private getCartProducts() {
    this.cartProductService.getAllCartProductsByCartId(this.currentCart.id).then(res => {
      res.forEach(cp => {
        this.getSupplierProduct(cp.supplierProductId);
      })
    })
  }

  private getSupplierProduct(id: number) {
    this.supplierProductService.getSupplierProductById(id).then(res => {
      this.checkCartBag(res);
    })
  }

  private checkCartBag(supplierProduct: SupplierProduct): void {
    this.cartBags.forEach(cb => {
      if (cb.idSupplier == supplierProduct.supplierId) {
        this.alerts.cartBags.check = true;
        this.addProductToCartBag(cb, supplierProduct);
        return;
      }
    });
    this.createCartBag(supplierProduct);
  }

  private addProductToCartBag(cartBag: CartBag, supplierProduct: SupplierProduct): void {
    this.productService.getProductById(supplierProduct.productId)
      .then(p => {
        cartBag.addProduct(supplierProduct, p);
      })
      .catch(error => {
        //TODO
      })
  }

  private createCartBag(supplierProduct: SupplierProduct): void {
    this.supplierService.getSupplierById(supplierProduct.id)
      .then(s => {
        this.cartBags.push(
          new CartBag(s.id, s.name, 100)
        )
      })
      .catch(error => {
        //TODO
      })
  }

  public getCartBags(): CartBag[] {
    return this.cartBags.sort((cb1, cb2) => {
      if (cb1.getTotalPrice() > cb2.getTotalPrice())
        return 1;
      else if (cb1.getTotalPrice() == cb2.getTotalPrice()) {
        if (cb1.getDistance() > cb2.getDistance())
          return 1;
        else if (cb1.getDistance() < cb2.getDistance())
          return -1;
        return 0;
      }
      return -1;

    })
  }

  deleteProduct() {
    this.alerts.cartBags.deletingProducts = true;
    this.cartProductService.deleteCartProductByCartIdAndSPId( //TODO SEBASTIAN
      this.cartBags[this.cartBagIndex].getSupplierId(), this.productToDelete.id)
      .then(res => {
        this.cartBagIndex[this.cartBagIndex].removeProduct(this.productToDelete.id);
        this.alerts.cartBags.deletingProducts = false;
        this.modalRef.hide();
        this.alerts.success = true;
        setTimeout(() => {
          this.alerts.success = false;
        }, 2500);
      })
      .catch(() => {
          this.alerts.cartBags.deletingProducts = false;
          this.alerts.cartBags.deletingError = true;
          setTimeout(() => {
            this.alerts.cartBags.deletingError = false;
          }, 5000);
        }
      )
  }

  openProductDeleteModal(template: TemplateRef<any>, cartBagIndex: number, product: Product) {
    this.cartBagIndex = cartBagIndex;
    this.productToDelete = product;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal() {
    this.cartBagIndex = -1;
    this.productToDelete = undefined;
  }
}
