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
  providers: [ProductService]
})
export class ProductsComponent implements OnInit {

  public productFormGroup: FormGroup;
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
    }
  };
  modalRef: BsModalRef;

  constructor(public fb: FormBuilder, public productService: ProductService, public router: Router, private titleService: Title, private modalService: BsModalService) {
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
      }
    };
    this.createProductFormControls();
    this.getProducts();
  }


  getProducts() {
    this.productService.products.then(res => {
      this.productsArray = res;
      this.alerts.products.error = false;
      this.alerts.products.loading = false;
    }).catch(err => {
      //TODO mostrar en el front mensaje de error
      this.alerts.products.error = true;
      this.alerts.products.loading = false;
    })
  }

  uploadProduct() {
    this.alerts.addProduct.loading = true;
    if(this.newProduct.id) {
      this.productService.updateProduct(this.newProduct).then(res => {
        this.alerts.addProduct.loading = false;
        this.alerts.addProduct.error = false;
        this.newProduct = Product.empty();
        this.productFormGroup.reset();
        this.modalRef.hide();
        //TODO Agregar alerts.success y mostrar un toast o algun mensaje de que se agrego con exito
      }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addProduct.loading = false;
        this.alerts.addProduct.error = true;
      })
    } else {
      this.productService.addProduct(this.newProduct).then(res => {
        this.productsArray.push(res);
        this.alerts.addProduct.loading = false;
        this.alerts.addProduct.error = false;
        this.newProduct = Product.empty();
        this.productFormGroup.reset();
        this.modalRef.hide();
        //TODO Agregar alerts.success y mostrar un toast o algun mensaje de que se agrego con exito
        // this.router.navigate(['products']);
      }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addProduct.loading = false;
        this.alerts.addProduct.error = true;
      })
    }
  }

  deleteProduct() {
    this.alerts.products.deleting = true;
    this.productService.deleteProduct(this.productToDelete.id).then(res => {
      this.productsArray.splice(this.productIndexToDelete,1);
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.products.deleting = false;
      this.alerts.products.deletingError = false;
      this.modalRef.hide();
    }).catch(() => {
      this.alerts.products.deleting = false;
      this.alerts.products.deletingError = true;
    })
  }


  private createProductFormControls() {
    this.productFormGroup = this.fb.group({
      name: ['', Validators.required],
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
