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
  public categoryToDelete: Category;
  public subcategoryToDelete: Subcategory;
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
      deleting: boolean,
      deletingError: boolean,
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
        deleting: false,
        deletingError: false
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
    if(this.newCategory.id) {
      this.categoryService.updateCategory(this.newCategory).then(res => {
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = false;
        this.newCategory = Category.empty();
        this.modalRef.hide();
        //TODO Agregar alerts.success y mostrar un toast o algun mensaje de que se agrego con exito
      }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = true;
      })
    } else {
      this.categoryService.addCategory(this.newCategory).then(res => {
        this.categoriesArray.push(res);
        this.categories.set(res.id, res);
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = false;
        this.newCategory = Category.empty();
        this.modalRef.hide();
        //TODO Agregar alerts.success y mostrar un toast o algun mensaje de que se agrego con exito
        // this.router.navigate(['categories']);
      }).catch(() => {
        //TODO mostrar en el front mensaje de error
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = true;
      })
    }
  }

  uploadSubcategory() {
    this.alerts.addCategory.loading = true;
    if(this.newCategory.id) {
      this.subcategoryService.updateSubcategory(this.newSubcategory).then(res => {
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = false;
        this.newSubcategory = Subcategory.empty();
        this.modalRef.hide();
      }).catch(() => {
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = true;
      })
    } else {
      this.newSubcategory.categoryId = parseInt(String(this.newSubcategory.categoryId));
      this.subcategoryService.addSubcategory(this.newSubcategory).then(res => {
        this.subcategories.push(res);
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = false;
        this.newSubcategory = Subcategory.empty();
        this.modalRef.hide();
      }).catch(() => {
        this.alerts.addCategory.loading = false;
        this.alerts.addCategory.error = true;
      })
    }
  }

  deleteCategory(category: Category, index) {
    for (let i = 0; i < this.subcategories.length; i++) {
      if (this.subcategories[i].categoryId == category.id) {
        this.deleteSubCategory(this.subcategories[i],i)
      }
    }
    this.categories.delete(category.id);
    this.categoriesArray.slice(index,1);
    this.categoryService.deleteCategory(category.id)

  }

  deleteSubCategory(subCategory: Subcategory, index) {
    this.alerts.subcategories.deleting = true;
    this.subcategoryService.deleteSubcategory(subCategory.id).then(res => {
      this.subcategories = this.subcategories.slice(index-1);
      //TODO mostrar mensajes de error/success/ y loader
      this.alerts.subcategories.deleting = false;
      this.alerts.subcategories.deletingError = false;
      this.modalRef.hide();
    }).catch(() => {
      this.alerts.subcategories.deleting = false;
      this.alerts.subcategories.deletingError = true;
    })
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

  openCategoryModal(template: TemplateRef<any>, category?) {
    if(category) this.newCategory = category;
    this.modalRef = this.modalService.show(template);
  }

  openSubcategoryModal(template: TemplateRef<any>, subcategory?) {
    if(subcategory) this.newSubcategory = subcategory;
    this.modalRef = this.modalService.show(template);
  }

  openCategoryDeleteModal(template: TemplateRef<any>, category, i) {
    this.categoryToDelete = category;
    this.deleteCategory(category, i);
    this.modalRef = this.modalService.show(template);
  }

  openSubcategoryDeleteModal(template: TemplateRef<any>, subcategory) {
    this.categoryToDelete = subcategory;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal(){
    this.categoryToDelete = undefined;
    this.subcategoryToDelete = undefined;
  }

}
