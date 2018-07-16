import {Component, OnInit, TemplateRef} from '@angular/core';
import {Product} from "../../../shared/models/product.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ProductService} from "../../../shared/services/product.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";

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
      loading: boolean,
      deleting: boolean,
    },
    addProduct: {
      loading: boolean,
    },
  };
  modalRef: BsModalRef;

  constructor(public productService: ProductService, public router: Router, private titleService: Title, private modalService: BsModalService, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newProduct = Product.empty();
    this.alerts = {
      products: {
        loading: true,
        deleting: false,
      },
      addProduct: {
        loading: false,
      },
    };
    this.getProducts();
  }


  getProducts() {
    this.productService.products.then(res => {
      this.productsArray = res.map(p => {
        return Product.from(p)
      });
      this.alerts.products.loading = false;
    }).catch(err => {
      this.snackBar.open('Hubo un error al obtener los productos, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      this.alerts.products.loading = false;
    })
  }

  validateProductA() {
    this.alerts.addProduct.loading = true;
    this.productService.validateProduct(this.newProduct.id).then(res => {
      this.newProduct.isValidated = true;
      this.alerts.addProduct.loading = false;
      this.newProduct = Product.empty();
      this.modalRef.hide();
      this.snackBar.open('El producto fue validado correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.addProduct.loading = false;
      this.snackBar.open('Hubo un error al validar el producto, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    })
  }

  deleteProduct() {
    this.alerts.products.deleting = true;
    this.productService.deleteProduct(this.productToDelete.id).then(res => {
      this.productsArray.splice(this.productIndexToDelete,1);
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.products.deleting = false;
      this.modalRef.hide();
      this.snackBar.open('El producto fue eliminado correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.products.deleting = false;
      this.snackBar.open('Hubo un error al eliminar el producto, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
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
