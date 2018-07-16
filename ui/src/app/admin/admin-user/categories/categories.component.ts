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
import {MatSnackBar} from "@angular/material";

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
  public categoryIndexToDelete: number;
  public categoryIndexUpdate: number;
  public subcategoryToDelete: Subcategory;
  public subcategoryIndexToDelete: number;
  public subcategoryIndexUpdate: number;
  public categories: Map<number, Category>;
  public categoriesArray: Category[];
  public subcategories: Subcategory[];
  public categoriesPage: number = 1;
  public subcategoriesPage: number = 1;
  public alerts: {
    categories: {
      loading: boolean,
      deleting: boolean,
    },
    addCategory: {
      loading: boolean,
    },
    subcategories: {
      loading: boolean,
      deleting: boolean,
    },
  };
  public newSubcategory: Subcategory;
  modalRef: BsModalRef;

  constructor(public fb: FormBuilder, public categoryService: CategoryService, public subcategoryService: SubcategoryService, public router: Router, private titleService: Title, private modalService: BsModalService, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newCategory = Category.empty();
    this.newSubcategory = Subcategory.empty();
    this.alerts = {
      categories: {
        loading: true,
        deleting: false,
      },
      addCategory: {
        loading: false,
      },
      subcategories: {
        loading: true,
        deleting: false,
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
      this.alerts.subcategories.loading = false;
    }).catch(() => {
      this.snackBar.open('Hubo un error al obtener las subcategorias, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      this.alerts.subcategories.loading = false;
    })
  }

  getCategories() {
    this.categoryService.categories.then(res => {
      this.categoriesArray = res;
      this.categoriesArray.forEach(c => {
        this.categories.set(c.id, c);
      });
      this.alerts.categories.loading = false;
    }).catch(err => {
      this.snackBar.open('Hubo un error al obtener las categorias, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
      this.alerts.categories.loading = false;
    })
  }

  uploadCategory() {
    this.alerts.addCategory.loading = true;
    if (this.newCategory.id) {
      this.categoryService.updateCategory(this.newCategory).then(res => {
        this.categories.set(res.id, res);
        this.categoriesArray[this.categoryIndexUpdate] = res;
        this.alerts.addCategory.loading = false;
        this.newCategory = Category.empty();
        this.categoryFormGroup.reset();
        this.modalRef.hide();
        this.snackBar.open('La categoria fue actualizada correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }).catch(() => {
        this.alerts.addCategory.loading = false;
        this.snackBar.open('Hubo un error al actualizar la categoria, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    } else {
      this.categoryService.addCategory(this.newCategory).then(res => {
        this.categoriesArray.push(res);
        this.categories.set(res.id, res);
        this.alerts.addCategory.loading = false;
        this.newCategory = Category.empty();
        this.categoryFormGroup.reset();
        this.modalRef.hide();
        this.snackBar.open('La categoria fue agregada correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }).catch(() => {
        this.alerts.addCategory.loading = false;
        this.snackBar.open('Hubo un error al agregar la categoria, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    }
  }

  uploadSubcategory() {
    this.alerts.addCategory.loading = true;
    if (this.newSubcategory.id) {
      this.newSubcategory.categoryId = parseInt(String(this.newSubcategory.categoryId));
      this.subcategoryService.updateSubcategory(this.newSubcategory).then(res => {
        this.subcategories[this.subcategoryIndexUpdate] = res;
        this.alerts.addCategory.loading = false;
        this.newSubcategory = Subcategory.empty();
        this.subcategoryFormGroup.reset();
        this.modalRef.hide();
        this.snackBar.open('La subcategoria fue actualizada correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }).catch(() => {
        this.alerts.addCategory.loading = false;
        this.snackBar.open('Hubo un error al agregar la subcategoria, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    } else {
      this.newSubcategory.categoryId = parseInt(String(this.newSubcategory.categoryId));
      this.subcategoryService.addSubcategory(this.newSubcategory).then(res => {
        this.subcategories.push(res);
        this.alerts.addCategory.loading = false;
        this.newSubcategory = Subcategory.empty();
        this.subcategoryFormGroup.reset();
        this.modalRef.hide();
        this.snackBar.open('La subcategoria fue agregada correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }).catch(() => {
        this.alerts.addCategory.loading = false;
        this.snackBar.open('Hubo un error al agregar la subcategoria, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top'
        });
      })
    }
  }

  deleteCategory() {
    this.alerts.categories.deleting = true;
    this.categoryService.deleteCategory(this.categoryToDelete.id).then(res => {
      this.deleteSubCategoriesByCatID(this.categoryToDelete.id);
      this.categoriesArray.splice(this.categoryIndexToDelete, 1);
      this.categories.delete(this.categoryToDelete.id);
      this.alerts.categories.deleting = false;
      this.modalRef.hide();
      this.snackBar.open('La categoria fue eliminada correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.categories.deleting = false;
      this.snackBar.open('Hubo un error al eliminar la categoria, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    })
  }

  /**
   * Private method to delete all products that match with the category deleted.
   */
  private deleteSubCategoriesByCatID(categoryId: number) {
    let i = 0;
    while (i < this.subcategories.length) {
      if (this.subcategories[i].categoryId == categoryId)
        this.subcategories.splice(i, 1);
      else
        i++;
    }
  }

  deleteSubCategory() {
    this.alerts.subcategories.deleting = true;
    this.subcategoryService.deleteSubcategory(this.subcategoryToDelete.id).then(res => {
      this.subcategories.splice(this.subcategoryIndexToDelete, 1);
      this.alerts.subcategories.deleting = false;
      this.modalRef.hide();
      this.snackBar.open('La subcategoria fue eliminada correctamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
    }).catch(() => {
      this.alerts.subcategories.deleting = false;
      this.snackBar.open('Hubo un error al eliminar la subcategoria, por favor inténtelo nuevamente.', '', {
        duration: 5000,
        verticalPosition: 'top'
      });
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

  openCategoryModal(template: TemplateRef<any>, i, category?) {
    if (category) this.newCategory = Object.assign({}, category);
    this.categoryIndexUpdate = i;
    this.modalRef = this.modalService.show(template);
  }

  openSubcategoryModal(template: TemplateRef<any>, i, subcategory?) {
    if (subcategory) this.newSubcategory = Object.assign({}, subcategory);
    this.subcategoryIndexUpdate = i;
    this.modalRef = this.modalService.show(template);
  }

  openCategoryDeleteModal(template: TemplateRef<any>, category, i) {
    this.subcategoryToDelete = undefined;
    this.categoryToDelete = category;
    this.categoryIndexToDelete = i;
    this.modalRef = this.modalService.show(template);
  }

  openSubcategoryDeleteModal(template: TemplateRef<any>, subcategory, i) {
    this.categoryToDelete = undefined;
    this.subcategoryToDelete = subcategory;
    this.subcategoryIndexToDelete = i;
    this.modalRef = this.modalService.show(template);
  }

  resetDeleteModal() {
    this.categoryToDelete = undefined;
    this.categoryIndexToDelete = -1;
    this.subcategoryIndexToDelete = -1;
    this.subcategoryToDelete = undefined;
  }


}
