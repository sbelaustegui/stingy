import {CartBagProduct} from "./cart-bag-product";

export class CartBag {

  public static from(jsonObject: any): CartBag {
    if (!jsonObject || !jsonObject.supplierName || !jsonObject.products) {
      throw new Error('Failed to instantiate SupplierProduct from given jsonObject');
    }
    return new CartBag(jsonObject.supplierName, jsonObject.products);
  }

  static empty(): CartBag {
    return new CartBag(undefined, [])
  }

  constructor(public supplierId: number, public products: CartBagProduct[]) {
  }
}
