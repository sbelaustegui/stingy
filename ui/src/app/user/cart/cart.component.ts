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
import {forEach} from "@angular/router/src/utils/collection";
import {Report} from "../../shared/models/report.model";
import {Supplier} from "../../shared/models/supplier.model";
import {User} from "../../shared/models/user.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CartService, CartProductService, UserService,
    UserAuthService, ProductService, SupplierService,
    SupplierProductService]
})

export class CartComponent implements OnInit {

  public userId: number;
  public currentCart: Cart;
  // public cartBags: CartBag[];
  public cartBags: Map<number, CartBag>;
  public cartBagsAugury: CartBag[];
  public productsPage: number = 1;
  public alerts: {
    details: {
      loading: boolean,
      error: boolean,
    },
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

  public productModal: Product;
  public supplierProductModal: SupplierProduct;

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
      details: {
        loading: false,
        error: false,
      },
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

    // this.cartBags = [];
    this.cartBags = new Map<number, CartBag>();
    this.cartBagsAugury = [];
    this.cartBagIndex = -1;
    this.productToDelete = undefined;
    this.getUserId();
  }

  /***
   * Gets user id and calls the current Cart.
   */
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

  /***
   * Get and save the current cart and calls SupplierProduct to create, by checking first, creates a new Cart .
   * @param {number} userId
   */
  getCurrentCart(userId: number) {
    this.cartService.getCartByUserId(userId)
      .then(res => {
        this.currentCart = res;
        this.alerts.cart.loading = false;
        this.alerts.cart.error = false;
        this.getCartSupplierProducts();
      })
      .catch(err => {
        console.log(err);
        this.alerts.cart.error = true;
        this.alerts.cart.loading = false;
      })
  }

  /***
   *
   */
  private getCartSupplierProducts() {
    //Gets all supplier-products for that current Cart.
    this.cartProductService.getAllCartProductsByCartId(this.currentCart.id)
      .then(res => {
        res.forEach(cartProduct => {
          //Get a specific supplier-product and check with cartBags.
          this.supplierProductService.getSupplierProductById(cartProduct.supplierProductId)
            .then(supplierProduct => {
              // this.checkCartBag(supplierProduct);
              this.addToCartBag(supplierProduct);
            })
            .catch(error => {
              //TODO
            })
        })
      })
      .catch(error => {
        //TODO
      })
  }

  private addToCartBag(sp: SupplierProduct) {
    if (this.cartBags.has(sp.supplierId) == true) {
      this.productService.getProductById(sp.productId)
        .then(p => {
          // this.cartBags.get(sp.supplierId).addSupplierProduct(sp, p);
          this.cartBags.get(sp.supplierId).addProduct(sp);
        })
    }
    else {
      this.supplierService.getSupplierById(sp.supplierId)
        .then(s => {
          const cartBagAux: CartBag = new CartBag(s.id, s.name, 100, this.supplierProductService, this.productService);
          this.cartBagsAugury.push(); //TODO DELETE THIS IS JUST FOR TESTING
          this.cartBags.set(sp.supplierId, cartBagAux);
          this.addToCartBag(sp);
        });

    }
  }

  public getCartBags(): CartBag[] {

    return Array.from(this.cartBags.values()).sort((cB1, cB2) => {
      if (cB1.getTotalPrice() > cB2.getTotalPrice())
        return 1;
      else if (cB1.getTotalPrice() == cB2.getTotalPrice()) {
        if (cB1.getDistance() > cB2.getDistance())
          return 1;
        else if (cB1.getDistance() < cB2.getDistance())
          return -1;
        return 0;
      }
      return -1;

    });
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

  openProductModal(template: TemplateRef<any>, product: Product, supplierProduct: SupplierProduct) {
    this.supplierProductModal = supplierProduct;
    this.productModal = product;
    this.modalRef = this.modalService.show(template);
  }

  openProductDeleteModal(template: TemplateRef<any>, cartBagIndex: number, product: Product) {
    this.cartBagIndex = cartBagIndex;
    this.productToDelete = product;
    this.modalRef = this.modalService.show(template);
  }

  resetModal(reference : string) {
    this.modalRef.hide();
    switch (reference.toUpperCase()) {
      case "PRODUCT":
        this.supplierProductModal = SupplierProduct.empty();
        this.productModal = Product.empty();
        break;
      case "PRODUCTDELETE":
        this.cartBagIndex = -1;
        this.productToDelete = undefined;
        break;
    }
  }
}
