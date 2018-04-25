import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Category} from "../../../shared/models/category.model";
import {Subcategory} from "../../../shared/models/subcategory.model";
import {CategoryService} from "../../../shared/services/category.service";

declare var require: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [CategoryService]
})
export class CategoriesComponent implements OnInit {
  // public formGroup: FormGroup;
  // public category: Category;
  // public subCategory: Subcategory;
  // public uploadCategoryError: boolean;
  // public addingCategory: boolean;

  constructor(public fb: FormBuilder, public categoryService: CategoryService, public router: Router, private titleService: Title) {}

  ngOnInit() {
  //   this.titleService.setTitle('ABM Categorias | Stingy');
  //   this.category = Category.empty();
  //   this.addingCategory = false;
  //   this.uploadCategoryError = false;
  //   this.createFormControls();
  // }
  //
  // uploadCategory() {
  //   this.addingCategory = true;
  //   this.categoryService.addCategory(this.category).then( () => {
  //     this.addingCategory = false;
  //     this.uploadCategoryError = false;
  //     this.router.navigate(['categories']);
  //   }).catch(() => {
  //     this.uploadCategoryError = true;
  //     this.addingCategory = false;
  //   })
  //
  // }
  //
  // private createFormControls() {
  //   this.formGroup = this.fb.group({
  //     name: ['', Validators.required],
  //     id: ['', Validators.required],
  //   })
  }
}
