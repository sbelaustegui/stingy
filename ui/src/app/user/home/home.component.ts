import { Component, OnInit } from '@angular/core';
import {Subcategory} from "../../shared/models/subcategory.model";
import {SubcategoryService} from "../../shared/services/subcategory.service";
import {Category} from "../../shared/models/category.model";
import {CategoryService} from "../../shared/services/category.service";
import {Title} from "@angular/platform-browser";
import {ProductService} from "../../shared/services/product.service";
import {Product} from "../../shared/models/product.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SubcategoryService, CategoryService, ProductService]
})
export class HomeComponent implements OnInit {

  public subcategories: Subcategory[];
  public searchedProducts : Product[];
  public selectedCategoryId: number;
  public productName: string;
  public selectedSubcategoryId: number;
  public categories: Category[];
  public alerts: {
    subcategories:{
      loading: boolean,
      error: boolean,
    },
    categories:{
      loading: boolean,
      error: boolean,
    },
    search:{
      loading: boolean,
      error: boolean,
    },
  };

  constructor(public subcategoryService: SubcategoryService, public categoryService: CategoryService, private titleService: Title, public productService: ProductService) {}

  ngOnInit() {
    this.titleService.setTitle('Búsqueda de Producto | Stingy');
    this.alerts = {
      subcategories: {
        loading: false,
        error: false,
      },
      categories: {
        loading: true,
        error: false,
      },
      search: {
        loading: false,
        error: false,
      },
    };
    this.subcategories = [];
    this.searchedProducts = [];
    this.getCategories();
  }

  getSubcategories(){
    this.subcategoryService.getSubcategoryByCategoryId(this.selectedCategoryId).then(res => {
      this.subcategories = res;
      this.alerts.subcategories.error = false;
      this.alerts.subcategories.loading = false;
    }).catch(err => {
      console.log(err);
      this.alerts.subcategories.error = true;
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories(){
    this.categoryService.categories.then(res => {
      this.categories = res;
      this.alerts.categories.error = false;
      this.alerts.categories.loading = false;
    }).catch(err => {
      console.log(err);
      this.alerts.categories.error = true;
      this.alerts.categories.loading = false;
    })
  }

  search(){
    this.productService.searchProduct({name: this.productName, subcategoryId: this.selectedSubcategoryId ? this.selectedSubcategoryId : 0}).then(res => {
      this.searchedProducts = res;
      //TODO agregar loader y mensaje de error
      this.alerts.search.error = false;
      this.alerts.search.loading = false;
    }).catch(err => {
      console.log(err);
      this.alerts.search.error = true;
      this.alerts.search.loading = false;
    })
  }
}
