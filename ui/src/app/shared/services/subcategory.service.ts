import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Subcategory} from "../models/subcategory.model";

/*
Subcategory routes
  POST        /api/subcategory                                    controllers.SubcategoryController.register()
  GET         /api/subcategory/all                                controllers.SubcategoryController.getAll
  GET         /api/subcategory/id/:id                             controllers.SubcategoryController.getById(id: Long)
  GET         /api/subcategory/categoryId/:categoryId             controllers.SubcategoryController.getByCategoryId(categoryId: Long)
  PUT         /api/subcategory                                    controllers.SubcategoryController.update()
  DELETE      /api/subcategory/:id                                controllers.SubcategoryController.delete(id: Long)
*/

@Injectable()
export class SubcategoryService {

  private _allSubcategoriesLoaded: boolean;
  private _SubcategoriesById: Map<number, Subcategory>;

  constructor(private http: HttpService) {
    this._allSubcategoriesLoaded = false;
    this._SubcategoriesById = new Map();
  }

  get subcategories(): Promise<Subcategory[]> {
    return this._allSubcategoriesLoaded ? Promise.resolve(this.allSubcategorysToArray()) : this.requestSubcategorys();
  }

  public getSubcategoryById(id: number): Promise<Subcategory> {
    return this._SubcategoriesById.get(id) ? Promise.resolve(this._SubcategoriesById.get(id)) : this.requestSubcategory(id);
  }

  public addSubcategory(category: Subcategory): Promise<Subcategory> {
    return this.http
      .post('/api/subcategory', category)
      .then(res => {
        this._SubcategoriesById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateSubcategory(category: Subcategory): Promise<Subcategory> {
    if(this._SubcategoriesById.get(category.id)) {
      return this.http
        .put('/api/subcategory', category)
        .then(res => {
          this._SubcategoriesById.set(category.id, res.data);
          return res.data;
        });
    } else {
      this.requestSubcategory(category.id).then(res => this.updateSubcategory(category));
    }
  }

  public deleteSubcategory(id: number): Promise<any> {
    return this.http.delete('/api/subcategory/' + id)
      .then(res => {
        this._SubcategoriesById.delete(id);
        return res;
      });
  }

  private allSubcategorysToArray(): Subcategory[] {
    return Array.from(this._SubcategoriesById.values());
  }

  private requestSubcategorys(): Promise<Subcategory[]> {
    return this.http
      .get('/api/subcategory/all')
      .then(res => {
        const Subcategories = res.data as Subcategory[];
        Subcategories.forEach(category => this._SubcategoriesById = this._SubcategoriesById.set(category.id, category));
        this._allSubcategoriesLoaded = true;
        return this.allSubcategorysToArray();
      });
  }

  private requestSubcategory(id: number): Promise<Subcategory> {
    return this.http
      .get('/api/subcategory/id/' + id)
      .then(res => {
        this._SubcategoriesById.set(id,res.data);
        return res.data;
      });
  }

  public getSubcategoryByCategoryId(categoryId: number): Promise<Subcategory> {
    return this.http
      .get('/api/subcategory/categoryId/' + categoryId)
      .then(res => {
        this._SubcategoriesById.set(res.data.id, res.data);
        return res.data;
      });
  }
}
