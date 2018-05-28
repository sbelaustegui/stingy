import {SupplierProduct} from "../models/supplier-product.model";
import {Injectable} from "@angular/core";
import {HttpService} from "./http.service";
import {SupplierProductLocation} from "../models/supplier-product-location-model";


/*
# Supplier Product
POST        /api/supplier/product                               controllers.SupplierProductController.register()
GET         /api/supplier/product/all                           controllers.SupplierProductController.getAll
GET         /api/supplier/product/id/:id                        controllers.SupplierProductController.getById(id: Long)
GET         /api/supplier/product/supplier/:id                  controllers.SupplierProductController.getBySupplierId(id: Long)
GET         /api/supplier/product/:productId                    controllers.SupplierProductController.getByProductId(productId: Long)
POST        /api/supplier/product/location                      controllers.SupplierProductController.getByLocation
PUT         /api/supplier/product                               controllers.SupplierProductController.update()
DELETE      /api/supplier/product/:id                           controllers.SupplierProductController.delete(id: Long)
 */

@Injectable()
export class SupplierProductService {

  private _allSupplierProductsLoaded: boolean;
  private _supplierProductProductsById: Map<number, SupplierProduct>;

  constructor(private http: HttpService) {
    this._allSupplierProductsLoaded = false;
    this._supplierProductProductsById = new Map();
  }

  get supplierProducts(): Promise<SupplierProduct[]> {
    return this._allSupplierProductsLoaded ? Promise.resolve(this.allSupplierProductsToArray()) : this.requestSupplierProducts();
  }

  public getSuppliersProductsBySupplierId(supplierId: number): Promise<SupplierProduct[]> {
    return this.http.get('/api/supplier/product/supplier/' + supplierId).then(
      res => {
        return res.data;
      }
    )
  }

  public getSupplierProductsByProductId(productId: number): Promise<SupplierProduct[]> {
    return this.http.get('/api/supplier/product/' + productId).then(res => {
        return res.data;
      }
    )
  }

  public getSuppliersProductsByUserLocation(productId: number, userId: number): Promise<SupplierProduct[]> {
    return this.http.post('/api/supplier/product/location', new SupplierProductLocation(userId,productId))
      .then(res => {
       return res.data;
      });
  }

  public getSupplierProductById(id: number): Promise<SupplierProduct> {
    return this._supplierProductProductsById.get(id) ? Promise.resolve(this._supplierProductProductsById.get(id)) : this.requestSupplierProduct(id);
  }

  public addSupplierProduct(supplierProduct: SupplierProduct): Promise<SupplierProduct> {
    return this.http
      .post('/api/supplier/product', supplierProduct)
      .then(res => {
        this._supplierProductProductsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateSupplierProduct(supplierProduct: SupplierProduct): Promise<SupplierProduct> {
    if (this._supplierProductProductsById.get(supplierProduct.id)) {
      return this.http
        .put('/api/supplier/product', supplierProduct)
        .then(res => {
          this._supplierProductProductsById.set(supplierProduct.id, res.data);
          return res.data;
        });
    } else {
      this.requestSupplierProduct(supplierProduct.id).then(res => this.updateSupplierProduct(supplierProduct));
    }
  }

  public deleteSupplierProduct(id: number): Promise<any> {
    return this.http.delete('/api/supplier/product/' + id)
      .then(res => {
        this._supplierProductProductsById.delete(id);
        return res;
      });
  }

  private allSupplierProductsToArray(): SupplierProduct[] {
    return Array.from(this._supplierProductProductsById.values());
  }

  private requestSupplierProducts(): Promise<SupplierProduct[]> {
    return this.http
      .get('/api/supplier/product/all')
      .then(res => {
        const supplierProducts = res.data as SupplierProduct[];
        supplierProducts.forEach(supplierProduct => this._supplierProductProductsById = this._supplierProductProductsById.set(supplierProduct.id, supplierProduct));
        this._allSupplierProductsLoaded = true;
        return this.allSupplierProductsToArray();
      });
  }

  private requestSupplierProduct(id: number): Promise<SupplierProduct> {
    return this.http
      .get('/api/supplier/product/id/' + id)
      .then(res => {
        this._supplierProductProductsById.set(id, res.data);
        return res.data;
      });
  }

}
