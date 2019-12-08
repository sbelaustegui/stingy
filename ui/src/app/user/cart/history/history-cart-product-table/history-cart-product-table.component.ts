import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SupplierProductCart} from "../../../../shared/models/supplier-product-cart.model";

@Component({
  selector: 'app-history-cart-product-table',
  templateUrl: './history-cart-product-table.component.html',
  styleUrls: ['./history-cart-product-table.component.scss']
})
export class HistoryCartProductTableComponent implements OnInit {

  displayedColumns = ['name', 'supplier', 'price'];
  dataSource: MatTableDataSource<SupplierProductCart>;

  @Input()
  supplierProducts: SupplierProductCart[] = [];


  constructor() {
    this.dataSource = new MatTableDataSource<SupplierProductCart>(this.supplierProducts)
  }

  ngOnInit() {
    this.dataSource.data = this.supplierProducts;
  }

}
