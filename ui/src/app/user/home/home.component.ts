import { Component, OnInit } from '@angular/core';
import {Subcategory} from "../../shared/models/subcategory.model";
import {SubcategoryService} from "../../shared/services/subcategory.service";
import {Category} from "../../shared/models/category.model";
import {CategoryService} from "../../shared/services/category.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [SubcategoryService, CategoryService]
})
export class HomeComponent implements OnInit {

  public showDropdown1: boolean;
  public showDropdown2: boolean;
  public subcategories: Subcategory[];
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
  };

  constructor(public subcategoryService: SubcategoryService, public categoryService: CategoryService) {}

  ngOnInit() {
    this.showDropdown1 = false;
    this.showDropdown2 = false;
    this.alerts = {
      subcategories: {
        loading: true,
        error: false,
      },
      categories: {
        loading: true,
        error: false,
      },

    };
    this.getSubcategories();
    this.getCategories();
  }

  getSubcategories(){
    this.subcategoryService.subcategories.then(res => {
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
}
