import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {CartProduct} from "../models/cartProduct.model";
import {Product} from "../models/product.model";

/*
# Cart Product
POST        /api/cart/product                                   controllers.CartProductController.register()
GET         /api/cart/product/all                               controllers.CartProductController.getAll
GET         /api/cart/product/id/:id                            controllers.CartProductController.getById(id: Long)
GET         /api/cart/product/cart/:id                          controllers.CartProductController.getByCartId(id: Long)
PUT         /api/cart/product                                   controllers.CartProductController.update()
DELETE      /api/cart/product/:id                               controllers.CartProductController.delete(id: Long)
*/

@Injectable()
export class CartProductService {

  private _allCartProductsLoaded: boolean;
  private _cartProductsById: Map<number, CartProduct>;

  constructor(private http: HttpService) {
    this._allCartProductsLoaded = false;
    this._cartProductsById = new Map();
  }

  public getAllCartProductsByCartId(cartId: number): Promise<CartProduct[]>{
    return this.http
      .get('/api/cart/product/cart/'+cartId)
      .then(res => {
        return res.data;
      })
  }
  get cartProducts(): Promise<CartProduct[]> {
    return this._allCartProductsLoaded ? Promise.resolve(this.allCartProductsToArray()) : this.requestCartProducts();
  }

  public getCartProductById(id: number): Promise<CartProduct> {
    return this._cartProductsById.get(id) ? Promise.resolve(this._cartProductsById.get(id)) : this.requestCartProduct(id);
  }

  public addCartProduct(cartProduct: CartProduct): Promise<CartProduct> {
    return this.http
      .post('/api/cartProduct', cartProduct)
      .then(res => {
        this._cartProductsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateCartProduct(cartProduct: CartProduct): Promise<CartProduct> {
    if(this._cartProductsById.get(cartProduct.id)) {
      return this.http
        .put('/api/cartProduct', cartProduct)
        .then(res => {
          this._cartProductsById.set(cartProduct.id, res.data);
          return res.data;
        });
    } else {
      this.requestCartProduct(cartProduct.id).then(res => this.updateCartProduct(cartProduct));
    }
  }

  public deleteCartProduct(id: number): Promise<any> {
    return this.http.delete('/api/cartProduct/' + id)
      .then(res => {
        this._cartProductsById.delete(id);
        return res;
      });
  }

  private allCartProductsToArray(): CartProduct[] {
    return Array.from(this._cartProductsById.values());
  }

  private requestCartProducts(): Promise<CartProduct[]> {
    return this.http
      .get('/api/cartProduct/all')
      .then(res => {
        const cartProducts = res.data as CartProduct[];
        cartProducts.forEach(cartProduct => this._cartProductsById = this._cartProductsById.set(cartProduct.id, cartProduct));
        this._allCartProductsLoaded = true;
        return this.allCartProductsToArray();
      });
  }

  private requestCartProduct(id: number): Promise<CartProduct> {
    return this.http
      .get('/api/cartProduct/id/' + id)
      .then(res => {
        this._cartProductsById.set(id,res.data);
        return res.data;
      });
  }
}
