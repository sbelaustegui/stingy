import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {Title} from "@angular/platform-browser";
import {CartService} from "../../shared/services/cart.service";
import {Router} from "@angular/router";
import {Cart} from "../../shared/models/cart.model";
import {CartProductService} from "../../shared/services/cartProduct.service";
import {UserService} from "../../shared/services/user.service";
import {UserAuthService} from "../../shared/auth/user/user-auth.service";
import {User} from "../../shared/models/user.model";
import {Product} from "../../shared/models/product.model";
import {CartProduct} from "../../shared/models/cartProduct.model";
import {ProductService} from "../../shared/services/product.service";
import {SupplierService} from "../../shared/services/supplier.service";
import {Supplier} from "../../shared/models/supplier.model";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [CartService, CartProductService, UserService, UserAuthService,ProductService,SupplierService]
})

export class CartComponent implements OnInit {

  public newCart: Cart;
  public cartProducts: CartProduct[];
  public products: Product[];
  public suppliers: Map<number, string>;
  // public productsPage: number = 1;
  public alerts: {
    cartProducts: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,

    };
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
    addCart: {
      error: boolean,
      loading: boolean,
    },
    success: boolean
  };
  modalRef: BsModalRef;

  constructor(public cartService: CartService, public cartProductService: CartProductService,
              public userService: UserService, public authService: UserAuthService,
              public productService: ProductService,
              public supplierService: SupplierService,
              public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newCart = Cart.empty();
    this.suppliers = new Map<number, string>();
    this.alerts = {
      cartProducts:{
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
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
      addCart: {
        error: false,
        loading:
          false,
      }
      ,
      success: false
    };
    this.getUser();
  }

  getUser() {
    this.authService.loggedUser.then(res => {
      this.getCart(res.id);
      this.alerts.user.loading = false;
      this.alerts.user.error = false;
    }).catch(() => {
      this.alerts.user.error = true;
      this.alerts.user.loading = false;
      setTimeout(() => this.alerts.user.error = false, 5000)
    })
  }

  getCart(userId: number) {
    this.cartService.getCartByUserId(userId).then(res => {
        this.newCart = res;
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
    this.cartProductService.getAllCartProductsByCartId(this.newCart.id).then(res => {
        this.cartProducts = res;
        this.alerts.cartProducts.loading = false;
        this.alerts.cartProducts.error = false;
        res.forEach(p => {
          this.getProduct(p.id)
        })
      }
    ).catch(err => {
      console.log(err);
      this.alerts.cartProducts.error = true;
      this.alerts.cartProducts.loading = false;
    })
  }

  private getProduct(id: number) {
    this.productService.getProductById(id).then( res => {
      if (!this.suppliers.has(res.supplierId)) {
        this.supplierService.getSupplierById(res.supplierId).then(sup => {
          this.suppliers.set(res.supplierId, sup.name)
        })
      }
      this.products.push(res);
    })
  }

  public getSuppliersArray(){
    return this.suppliers.values();
  }

  // deleteProduct() {
  //   this.alerts.cartProducts.deleting = true;
  //   this.cartProductService.deleteCartProduct(this.productToDelete.id).then(res => {
  //     this.cartProducts.splice(this.productIndexToDelete,1);
  //     //TODO mostrar mensajes de error/success/ y loader
  //     this.alerts.products.deleting = false;
  //     this.alerts.products.deletingError = false;
  //     this.modalRef.hide();
  //     this.alerts.success = true;
  //     setTimeout(() => {this.alerts.success = false;},2500);
  //   }).catch(() => {
  //     this.alerts.products.deleting = false;
  //     this.alerts.products.deletingError = true;
  //     setTimeout(() => {this.alerts.products.deletingError = false;},5000);
  //   })
  // }
  //
  // openProductDeleteModal(template: TemplateRef<any>, product, i) {
  //   this.cartProductToDelete = product;
  //   this.cartProductIndexToDelete = i;
  //   this.modalRef = this.modalService.show(template);
  // }
  //
  // resetDeleteModal(){
  //   this.productToDelete = undefined;
  //   this.productIndexToDelete = -1;
  // }


}
