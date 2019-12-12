import {Component, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {CartBagProduct} from "../../../shared/models/cart-bag-product";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {CartProductService} from "../../../shared/services/cartProduct.service";
import {DateModel} from "../../../shared/models/date-model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-cart-product-table',
  templateUrl: './cart-product-table.component.html',
  styleUrls: ['./cart-product-table.component.scss']
})
export class CartProductTableComponent implements OnInit {
  displayedColumns = ['name', 'details', 'lastUpdate', 'price', 'remove'];
  dataSource: MatTableDataSource<CartBagProduct>;

  modalRef: BsModalRef;

  @Input()
  cartBagProducts: CartBagProduct[] = [];
  @Input()
  cartId: number;

  @Output()
  $deleteCartEvent: BehaviorSubject<CartBagProduct> = new BehaviorSubject<CartBagProduct>(null);

  cartBagProductDetail: CartBagProduct = CartBagProduct.empty();
  cartBagProductToDelete: CartBagProduct = CartBagProduct.empty();

  constructor(
    private modalService: BsModalService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<CartBagProduct>(this.cartBagProducts);
  }


  deleteProduct() {
    this.$deleteCartEvent.next(this.cartBagProductToDelete);
    this.modalRef.hide();

  }

  openProductModal(template: TemplateRef<any>, cartBagProduct: CartBagProduct) {
    this.cartBagProductDetail = cartBagProduct;
    this.modalRef = this.modalService.show(template);
  }

  openProductDeleteModal(template: TemplateRef<any>, cartBagProductToDelete: CartBagProduct) {
    this.cartBagProductToDelete = cartBagProductToDelete;
    this.modalRef = this.modalService.show(template);
  }
  resetModal(reference: string) {
    this.modalRef.hide();
    switch (reference.toUpperCase()) {
      case "PRODUCT":
        this.cartBagProductDetail = CartBagProduct.empty();
        break;
      case "PRODUCTDELETE":
        this.cartBagProductToDelete = CartBagProduct.empty();
        break;
    }
  }

  dateModelToString(dateModel: DateModel): string {
    return dateModel ?
      dateModel.day + '/' + dateModel.month + '/' + dateModel.year
      : '';
  }


}
