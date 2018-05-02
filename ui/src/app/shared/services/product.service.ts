import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Product} from "../models/product.model";

/*
# Product
  POST        /api/product                                        controllers.ProductController.register()
  GET         /api/product/all                                    controllers.ProductController.getAll
  GET         /api/product/id/:id                                 controllers.ProductController.getById(id: Long)
  PUT         /api/product                                        controllers.ProductController.update()
  DELETE      /api/product/:id                                    controllers.ProductController.delete(id: Long)
*/

@Injectable()
export class ProductService {

  private _allProductsLoaded: boolean;
  private _productsById: Map<number, Product>;

  constructor(private http: HttpService) {
    this._allProductsLoaded = false;
    this._productsById = new Map();
  }

  get products(): Promise<Product[]> {
    return this._allProductsLoaded ? Promise.resolve(this.allProductsToArray()) : this.requestProducts();
  }

  public getProductById(id: number): Promise<Product> {
    return this._productsById.get(id) ? Promise.resolve(this._productsById.get(id)) : this.requestProduct(id);
  }

  public addProduct(product: Product): Promise<Product> {
    return this.http
      .post('/api/product', product)
      .then(res => {
        this._productsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateProduct(product: Product): Promise<Product> {
    if(this._productsById.get(product.id)) {
      return this.http
        .put('/api/product', product)
        .then(res => {
          this._productsById.set(product.id, res.data);
          return res.data;
        });
    } else {
      this.requestProduct(product.id).then(() => this.updateProduct(product));
    }
  }

  public deleteProduct(id: number): Promise<any> {
    return this.http.delete('/api/product/' + id)
      .then(res => {
        this._productsById.set(id, res.data);
        return res.data;
      });
  }

  public validateProduct(id: number): Promise<any> {
    return this.http.get('/api/product/validate/' + id)
      .then(res => {
        this._productsById.delete(id);
        return res;
      });
  }

  private allProductsToArray(): Product[] {
    return Array.from(this._productsById.values());
  }

  private requestProducts(): Promise<Product[]> {
    return this.http
      .get('/api/product/all')
      .then(res => {
        const products = res.data as Product[];
        products.forEach(product => this._productsById = this._productsById.set(product.id, product));
        this._allProductsLoaded = true;
        return this.allProductsToArray();
      });
  }

  private requestProduct(id: number): Promise<Product> {
    return this.http
      .get('/api/product/id/' + id)
      .then(res => {
        this._productsById.set(id,res.data);
        return res.data;
      });
  }
}
