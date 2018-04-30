import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {Category} from "../../../shared/models/category.model";
import {Subcategory} from "../../../shared/models/subcategory.model";
import {CategoryService} from "../../../shared/services/category.service";
import {SubcategoryService} from "../../../shared/services/subcategory.service";
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [CategoryService, SubcategoryService]
})
export class CategoriesComponent implements OnInit {

  public categoryFormGroup: FormGroup;
  public subcategoryFormGroup: FormGroup;
  public newCategory: Category;
  public categories: Map<number, Category>;
  public categoriesArray: Category[];
  public subcategories: Subcategory[];
  public alerts: {
    categories: {
      error: boolean,
      loading: boolean,
    },
    addCategory: {
      error: boolean,
      loading: boolean,
    },
    subcategories: {
      error: boolean,
      loading: boolean,
    },
  };
  public newSubcategory: Subcategory;
  modalRef: BsModalRef;

  constructor(public fb: FormBuilder, public categoryService: CategoryService, public subcategoryService: SubcategoryService, public router: Router, private titleService: Title, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newCategory = Category.empty();
    this.newSubcategory = Subcategory.empty();
    this.alerts = {
      categories: {
        error: false,
        loading: true,
      },
      addCategory: {
        error: false,
        loading: false,
      },
      subcategories: {
        error: false,
        loading: true,
      },
    };
    this.categories = new Map<number, Category>();
    this.createCategoryFormControls();
    this.createSubcategoryFormControls();
    this.getCategories();
    this.getSubcategories();
  }

  getSubcategories() {
    this.subcategoryService.subcategories.then(res => {
      this.subcategories = res;
      this.alerts.subcategories.error = false;
      this.alerts.subcategories.loading = false;
    }).catch(err => {
      //TODO mostrar en el front mensaje de error
      this.alerts.subcategories.error = true;
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories() {
    this.categoryService.categories.then(res => {
      this.categoriesArray = res;
      this.categoriesArray.forEach(c => {
        this.categories.set(c.id, c);
      });
      this.alerts.categories.error = false;
      this.alerts.categories.loading = false;
    }).catch(err => {
      //TODO mostrar en el front mensaje de error
      this.alerts.categories.error = true;
      this.alerts.categories.loading = false;
    })
  }

  uploadCategory() {
    this.alerts.addCategory.loading = true;
    this.categoryService.addCategory(this.newCategory).then(res => {
      this.categoriesArray.push(res);
      this.categories.set(res.id, res);
      this.alerts.addCategory.loading = false;
      this.alerts.addCategory.error = false;
      this.newCategory = Category.empty();
      //TODO Agregar alerts.success y mostrar un toast o algun mensaje de que se agrego con exito
      // this.router.navigate(['categories']);
    }).catch(() => {
      //TODO mostrar en el front mensaje de error
      this.alerts.addCategory.loading = false;
      this.alerts.addCategory.error = true;
    })
  }

  uploadSubcategory() {
    this.alerts.addCategory.loading = true;
    this.newSubcategory.categoryId = parseInt(String(this.newSubcategory.categoryId));
    this.subcategoryService.addSubcategory(this.newSubcategory).then(res => {
      this.subcategories.push(res);
      this.alerts.addCategory.loading = false;
      this.alerts.addCategory.error = false;
      this.newSubcategory = Subcategory.empty();
    }).catch(() => {
      this.alerts.addCategory.loading = false;
      this.alerts.addCategory.error = true;
    })
  }

  deleteCategory(category: Category, index) {
    for (let i = 0; i < this.subcategories.length; i++) {
      if (this.subcategories[i].categoryId == category.id) {
        this.deleteSubCategory(this.subcategories[i],i)
      }
    }
    this.categories.delete(category.id)
    this.categoriesArray.slice(index,1);
    this.categoryService.deleteCategory(category.id)

  }

  deleteSubCategory(subCategory: Subcategory, index) {
    this.subcategories.slice(index); //remove element from array by index
    this.subcategoryService.deleteSubcategory(subCategory.id)
  }

  private createCategoryFormControls() {
    this.categoryFormGroup = this.fb.group({
      name: ['', Validators.required],
    })
  }

  private createSubcategoryFormControls() {
    this.subcategoryFormGroup = this.fb.group({
      name: ['', Validators.required],
      categoryId: [Number, Validators.required],
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
