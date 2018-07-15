import {Component, OnInit, TemplateRef} from '@angular/core';
import {Product} from "../../../shared/models/product.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../../shared/services/product.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  public newProduct: Product;
  public productToDelete: Product;
  public productIndexToDelete: number;
  public productsArray: Product[];
  public productsPage: number = 1;
  public alerts: {
    products: {
      error: boolean,
      loading: boolean,
      deleting: boolean,
      deletingError: boolean,
    },
    addProduct: {
      error: boolean,
      loading: boolean,
    },
    success: boolean
  };
  modalRef: BsModalRef;

  constructor(public productService: ProductService, public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newProduct = Product.empty();
    this.alerts = {
      products: {
        error: false,
        loading: true,
        deleting: false,
        deletingError: false,
      },
      addProduct: {
        error: false,
        loading: false,
      },
      success:false
    };
    this.getProducts();
  }


  getProducts() {
    this.productService.products.then(res => {
      this.productsArray = res.map(p => {
        return Product.from(p)
      });
      this.alerts.products.error = false;
      this.alerts.products.loading = false;
    }).catch(err => {
      console.log(err);
      //TODO mostrar en el front mensaje de error
      this.alerts.products.error = true;
      this.alerts.products.loading = false;
    })
  }

  validateProductA() {
    this.alerts.addProduct.loading = true;
    this.productService.validateProduct(this.newProduct.id).then(res => {
      this.newProduct.isValidated = true;
      this.alerts.addProduct.loading = false;
      this.alerts.addProduct.error = false;
      this.newProduct = Product.empty();
      this.modalRef.hide();
      this.alerts.success = true;
      setTimeout(() => {this.alerts.success = false;},2500);
    }).catch(() => {
      //TODO mostrar en el front mensaje de error
      this.alerts.addProduct.loading = false;
      this.alerts.addProduct.error = true;
      this.alerts.addProduct.error = true;
      setTimeout(() => {this.alerts.addProduct.error = false;},5000);
    })
  }

  deleteProduct() {
    this.alerts.products.deleting = true;
    this.productService.deleteProduct(this.productToDelete.id).then(res => {
      this.productsArray.splice(this.productIndexToDelete,1);
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.products.deleting = false;
      this.alerts.products.deletingError = false;
      this.modalRef.hide();
      this.alerts.success = true;
      setTimeout(() => {this.alerts.success = false;},2500);
    }).catch(() => {
      this.alerts.products.deleting = false;
      this.alerts.products.deletingError = true;
      setTimeout(() => {this.alerts.products.deletingError = false;},5000);
    })
  }


  openProductModal(template: TemplateRef<any>, product?) {
    if(product) this.newProduct = product;
    this.modalRef = this.modalService.show(template);
  }


  openProductDeleteModal(template: TemplateRef<any>, product, i) {
    this.productToDelete = product;
    this.productIndexToDelete = i;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal(){
    this.productToDelete = undefined;
    this.productIndexToDelete = -1;
  }

}
