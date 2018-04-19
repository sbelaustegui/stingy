import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Supplier} from "../models/supplier.model";

/*
# Supplier
  POST        /api/supplier                                       controllers.SupplierController.register()
  GET         /api/supplier/all                                   controllers.SupplierController.getAll
  GET         /api/supplier/id/:id                                controllers.SupplierController.getById(id: Long)
  PUT         /api/supplier                                       controllers.SupplierController.update()
  DELETE      /api/supplier/:id                                   controllers.SupplierController.delete(id: Long)
*/

@Injectable()
export class SupplierService {

  private _allSuppliersLoaded: boolean;
  private _suppliersById: Map<number, Supplier>;

  constructor(private http: HttpService) {
    this._allSuppliersLoaded = false;
    this._suppliersById = new Map();
  }

  get suppliers(): Promise<Supplier[]> {
    return this._allSuppliersLoaded ? Promise.resolve(this.allSuppliersToArray()) : this.requestSuppliers();
  }

  public getSupplierById(id: number): Promise<Supplier> {
    return this._suppliersById.get(id) ? Promise.resolve(this._suppliersById.get(id)) : this.requestSupplier(id);
  }

  public addSupplier(supplier: Supplier): Promise<Supplier> {
    return this.http
      .post('/api/supplier', supplier)
      .then(res => {
        this._suppliersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateSupplier(supplier: Supplier): Promise<Supplier> {
    if(this._suppliersById.get(supplier.id)) {
      return this.http
        .put('/api/supplier', supplier)
        .then(res => {
          this._suppliersById.set(supplier.id, res.data);
          return res.data;
        });
    } else {
      this.requestSupplier(supplier.id).then(res => this.updateSupplier(supplier));
    }
  }

  public deleteSupplier(id: number): Promise<any> {
    return this.http.delete('/api/supplier/' + id)
      .then(res => {
        this._suppliersById.delete(id);
        return res;
      });
  }

  private allSuppliersToArray(): Supplier[] {
    return Array.from(this._suppliersById.values());
  }

  private requestSuppliers(): Promise<Supplier[]> {
    return this.http
      .get('/api/supplier/all')
      .then(res => {
        const suppliers = res.data as Supplier[];
        suppliers.forEach(supplier => this._suppliersById = this._suppliersById.set(supplier.id, supplier));
        this._allSuppliersLoaded = true;
        return this.allSuppliersToArray();
      });
  }

  private requestSupplier(id: number): Promise<Supplier> {
    return this.http
      .get('/api/supplier/id/' + id)
      .then(res => {
        this._suppliersById.set(id,res.data);
        return res.data;
      });
  }
}
