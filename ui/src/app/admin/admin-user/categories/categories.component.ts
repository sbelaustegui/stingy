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
import {MatSnackBar, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [CategoryService, SubcategoryService]
})
export class CategoriesComponent implements OnInit {
  categories_Columns = ['id', 'name', 'update', 'remove'];
  categories_DataSource: MatTableDataSource<Category>;

  subCategories_Columns = ['id', 'name', 'categoryId', 'update', 'remove'];
  subCategories_DataSource: MatTableDataSource<Subcategory>;

  public categoryFormGroup: FormGroup;
  public subcategoryFormGroup: FormGroup;
  public newCategory: Category;
  public categoryToDelete: Category;
  public subcategoryToDelete: Subcategory;
  public categories: Category[] = [];
  public subcategories: Subcategory[] = [];

  public alerts: {
    categories: {
      loading: boolean,
      deleting: boolean,
    },
    add: {
      category: boolean,
      subCategory: boolean,
      loading: boolean,
    },
    subcategories: {
      loading: boolean,
      deleting: boolean,
    },
  };
  public newSubcategory: Subcategory;
  modalRef: BsModalRef;

  constructor(public fb: FormBuilder, public categoryService: CategoryService,
              public subcategoryService: SubcategoryService,
              public router: Router, private titleService: Title,
              private modalService: BsModalService, public snackBar: MatSnackBar) {
    this.titleService.setTitle('ABM Categorias | Stingy');
    this.newCategory = Category.empty();
    this.newSubcategory = Subcategory.empty();
    this.alerts = {
      categories: {
        loading: true,
        deleting: false,
      },
      add: {
        category: false,
        subCategory: false,
        loading: false,
      },
      subcategories: {
        loading: true,
        deleting: false,
      },
    };
    this.createCategoryFormControls();
    this.createSubcategoryFormControls();
    this.getCategories();
    this.getSubcategories();
    this.subCategories_DataSource = new MatTableDataSource(this.subcategories);
    this.categories_DataSource = new MatTableDataSource(this.categories);

  }

  ngOnInit() {
  }

  getSubcategories() {
    this.subcategoryService.subcategories
      .then(res => {
        this.alerts.subcategories.loading = true;
        this.subcategories = res;
        this.subCategories_DataSource.data = this.subcategories;
        this.alerts.subcategories.loading = false;
      })
      .catch(() => {
        this.snackBar.open('Hubo un error al obtener las subcategorias, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error']
        });
        this.alerts.subcategories.loading = false;
      })
  }

  getCategories() {
    this.categoryService.categories
      .then(res => {
        this.alerts.categories.loading = true;
        this.categories = res;
        this.categories_DataSource.data = this.categories;
        this.alerts.categories.loading = false;
      })
      .catch(err => {
        this.snackBar.open('Hubo un error al obtener las categorias, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error']
        });
        this.alerts.categories.loading = false;
      })
  }

  uploadCategory() {
    this.alerts.add.loading = true;
    if (this.newCategory.id) {
      this.categoryService.updateCategory(this.newCategory)
        .then(res => {
          this.categories = this.categories.filter(c => c.id !== res.id);
          this.categories = [...this.categories, res];
          this.categories_DataSource.data = this.categories;
          this.alerts.add.loading = false;
          this.newCategory = Category.empty();
          this.categoryFormGroup.reset();
          this.modalRef.hide();
          this.snackBar.open('La categoria fue actualizada correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-success']

          });
        })
        .catch(() => {
          this.alerts.add.loading = false;
          this.snackBar.open('Hubo un error al actualizar la categoria, por favor inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-error']
          });
        })
    } else {
      this.categoryService.addCategory(this.newCategory)
        .then(res => {
          this.categories = [...this.categories, res];
          this.categories_DataSource.data = this.categories;
          this.alerts.add.loading = false;
          this.newCategory = Category.empty();
          this.categoryFormGroup.reset();
          this.modalRef.hide();
          this.snackBar.open('La categoria fue agregada correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-success']

          });
        })
        .catch(() => {
          this.alerts.add.loading = false;
          this.snackBar.open('Hubo un error al agregar la categoria, por favor inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-error']
          });
        })
    }
  }

  uploadSubcategory() {
    this.alerts.add.loading = true;
    if (this.newSubcategory.id) {
      this.newSubcategory.categoryId = parseInt(String(this.newSubcategory.categoryId));
      this.subcategoryService.updateSubcategory(this.newSubcategory)
        .then(res => {
          this.subcategories = this.subcategories.filter(s => s.id !== res.id);
          this.subcategories = [...this.subcategories, res];
          this.subCategories_DataSource.data = this.subcategories;
          this.alerts.add.loading = false;
          this.newSubcategory = Subcategory.empty();
          this.subcategoryFormGroup.reset();
          this.modalRef.hide();
          this.snackBar.open('La subcategoria fue actualizada correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-success']
          });
        })
        .catch(() => {
          this.alerts.add.loading = false;
          this.snackBar.open('Hubo un error al agregar la subcategoria, por favor inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-error']
          });
        })
    } else {
      this.newSubcategory.categoryId = parseInt(String(this.newSubcategory.categoryId));
      this.subcategoryService.addSubcategory(this.newSubcategory)
        .then(res => {
          this.subcategories = [...this.subcategories, res];
          this.subCategories_DataSource.data = this.subcategories;
          this.alerts.add.loading = false;
          this.newSubcategory = Subcategory.empty();
          this.subcategoryFormGroup.reset();
          this.modalRef.hide();
          this.snackBar.open('La subcategoria fue agregada correctamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-success']
          });
        })
        .catch(() => {
          this.alerts.add.loading = false;
          this.snackBar.open('Hubo un error al agregar la subcategoria, por favor inténtelo nuevamente.', '', {
            duration: 5000,
            verticalPosition: 'top',
            panelClass: ['snack-bar-error']
          });
        })
    }
  }

  deleteCategory() {
    this.alerts.categories.deleting = true;
    this.categoryService.deleteCategory(this.categoryToDelete.id)
      .then(() => {
        this.categories = this.categories.filter(c => c.id !== this.categoryToDelete.id);
        this.deleteSubCategoriesByCatID(this.categoryToDelete.id);
        console.log('Categories', this.categories);
        this.categories_DataSource.data = this.categories;
        this.alerts.categories.deleting = false;
        this.modalRef.hide();

        this.snackBar.open('La categoria fue eliminada correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-success']
        });
      })
      .catch(() => {
        this.alerts.categories.deleting = false;
        this.snackBar.open('Hubo un error al eliminar la categoria, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error']
        });
      })
  }

  private deleteSubCategoriesByCatID(categoryId: number) {
    this.subcategories = this.subcategories.filter(f => f.categoryId !== categoryId);
    this.subCategories_DataSource.data = this.subcategories;
  }

  deleteSubCategory() {
    this.alerts.subcategories.deleting = true;
    this.subcategoryService.deleteSubcategory(this.subcategoryToDelete.id)
      .then(() => {
        this.subcategories = this.subcategories.filter(s => s.id !== this.subcategoryToDelete.id);
        this.subCategories_DataSource.data = this.subcategories;
        this.alerts.subcategories.deleting = false;
        this.modalRef.hide();
        this.snackBar.open('La subcategoria fue eliminada correctamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-success']
        });
      })
      .catch(() => {
        this.alerts.subcategories.deleting = false;
        this.snackBar.open('Hubo un error al eliminar la subcategoria, por favor inténtelo nuevamente.', '', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ['snack-bar-error']
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

  openModal(template: TemplateRef<any>, modalReference: string,
            id?: number) {

    if (id) {
      switch (modalReference.toUpperCase()) {
        case "CATEGORY":
          this.alerts.add.category = false;
          const c = this.categories.find(c => c.id === id);
          this.newCategory = Object.assign({}, c);
          break;
        case "SUBCATEGORY":
          this.alerts.add.subCategory = false;
          const s = this.subcategories.find(s => s.id === id);
          this.newSubcategory = Object.assign({}, s);
          break;
        case "CATEGORYDELETE":
          this.categoryToDelete = this.categories.find(c => c.id === id);
          break;
        case "SUBCATEGORYDELETE":
          this.subcategoryToDelete = this.subcategories.find(s => s.id === id);
          break;
      }
    } else {
      switch (modalReference.toUpperCase()) {
        case "CATEGORY":
          this.alerts.add.category = true;
          this.newCategory = Category.empty();
          break;
        case "SUBCATEGORY":
          this.alerts.add.subCategory = true;
          this.newSubcategory = Subcategory.empty();
          break;
      }
    }

    this.modalRef = this.modalService.show(template);
  }

  resetModal(modalReference: string) {
    switch (modalReference.toUpperCase()) {
      case "CATEGORY":
        this.newCategory = Category.empty();
        break;
      case "SUBCATEGORY":
        this.newSubcategory = Subcategory.empty();
        break;
      case "DELETE":
        this.categoryToDelete = undefined;
        this.subcategoryToDelete = undefined;
        break;
    }
  }


  applyCategoryFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.categories_DataSource.filter = filterValue;
  }

  applySubcategoriesFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.subCategories_DataSource.filter = filterValue;
  }

  findCategory(subcategory: Subcategory): Category {
    const c = this.categories.find(c => c.id === subcategory.categoryId);
    return c ? c : Category.empty();
  }

}
