import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Cart} from "../models/cart.model";
import {CartBag} from "../models/cart-bag.model";

/*
# Cart
POST        /api/cart                                           controllers.CartController.register()
GET         /api/cart/all                                       controllers.CartController.getAll
GET         /api/cart/id/:id                                    controllers.CartController.getById(id: Long)
GET         /api/cart/user/:id                                  controllers.CartController.getByUserId(id: Long)
GET         /api/carts/user/:id                                 controllers.CartController.getCartsByUserId(id: Long)
GET         /api/cart/cartBags/:cartId                          controllers.CartController.getCartBagsByCartId(cartId: Long)
PUT         /api/cart                                           controllers.CartController.update()
DELETE      /api/cart/:id                                       controllers.CartController.delete(id: Long)
GET         api/cart/finish/:cartID                           controllers.CartController.getById(id: Long)

*/

@Injectable()
export class CartService {

  private _allCartsLoaded: boolean;
  private _cartsById: Map<number, Cart>;

  constructor(private http: HttpService) {
    this._allCartsLoaded = false;
    this._cartsById = new Map();
  }

  public cartFinish(cartID: number): Promise<Cart> {
    return this.http.get(' api/cart/finish/' + cartID).then(res => {
      return res.data
    });
  }

  get carts(): Promise<Cart[]> {
    return this._allCartsLoaded ? Promise.resolve(this.allCartsToArray()) : this.requestCarts();
  }

  public getCartBagsById(cartId: number): Promise<CartBag[]> {
    return this.http
      .get("/api/cart/cartBags/" + cartId)
      .then(res => {
        return res.data;
      });
  }

  public getCartByUserId(userId: number): Promise<Cart> {
    return this.http
      .get('/api/cart/user/' + userId)
      .then(res => {
        return res.data;
      });
  }

  public getCartsByUserId(userId: number): Promise<Cart[]> {
    return this.http
      .get('/api/carts/user/' + userId)
      .then(res => {
        return res.data;
      });
  }

  public getCartById(id: number): Promise<Cart> {
    return this._cartsById.get(id) ? Promise.resolve(this._cartsById.get(id)) : this.requestCart(id);
  }

  public addCart(cart: Cart): Promise<Cart> {
    return this.http
      .post('/api/cart', cart)
      .then(res => {
        this._cartsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateCart(cart: Cart): Promise<Cart> {
    if (this._cartsById.get(cart.id)) {
      return this.http
        .put('/api/cart', cart)
        .then(res => {
          this._cartsById.set(cart.id, res.data);
          return res.data;
        });
    } else {
      this.requestCart(cart.id).then(res => this.updateCart(cart));
    }
  }

  public deleteCart(id: number): Promise<any> {
    return this.http.delete('/api/cart/' + id)
      .then(res => {
        this._cartsById.delete(id);
        return res;
      });
  }

  private allCartsToArray(): Cart[] {
    return Array.from(this._cartsById.values());
  }

  private requestCarts(): Promise<Cart[]> {
    return this.http
      .get('/api/cart/all')
      .then(res => {
        const carts = res.data as Cart[];
        carts.forEach(cart => this._cartsById = this._cartsById.set(cart.id, cart));
        this._allCartsLoaded = true;
        return this.allCartsToArray();
      });
  }

  private requestCart(id: number): Promise<Cart> {
    return this.http
      .get('/api/cart/id/' + id)
      .then(res => {
        this._cartsById.set(id, res.data);
        return res.data;
      });
  }
}
