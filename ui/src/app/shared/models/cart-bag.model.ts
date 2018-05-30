import {Product} from "./product.model";
import {SupplierProduct} from "./supplier-product.model";

export class CartBag {

  private readonly _supplierId: number;
  private readonly _nameSup: string;
  private _products: Product[];
  private _supplierProducts: Map<number, SupplierProduct>; // key as productId;
  private _totalPrice: number;
  private readonly _distance: number;

  static empty(idSupplier: number, nameSupplier: string, distanceToUser: number): CartBag {
    return new CartBag(idSupplier, nameSupplier, distanceToUser);
  }

  constructor(public idSupplier: number, public nameSupplier: string, public  distanceToUser: number) {
    this._supplierId = idSupplier;
    this._nameSup = nameSupplier;
    this._distance = distanceToUser;
    this._products = [];
    this._supplierProducts = new Map<number, SupplierProduct>();
    this._totalPrice = 0;
  }

  addProduct(supplierProduct: SupplierProduct, product: Product) {
    if (supplierProduct.supplierId == this._supplierId) {
      if (product.id == supplierProduct.productId && !this._supplierProducts.has(product.id)) {
        this._totalPrice += supplierProduct.price;
        this._supplierProducts.set(product.id, supplierProduct);
        this._products.push(product);
      } else
        throw new Error("SupplierProduct doesn't match with id Product or is already loaded!")
    } else
      throw new Error("SupplierProduct doesn't match with id Supplier in CartBag!");
  }

  removeProduct(productId: number) {
    if (this._supplierProducts.has(productId)){
      this._totalPrice -= this._supplierProducts.get(productId).price;
      this._supplierProducts.delete(productId);
    }
    for (let i = 0; i < this._products.length; i++) {
      if (this._products[i].id == productId){
        this._products.splice(i, 1);
        return;
      }
    }

  }

  getSupplierId(): number {
    return this._supplierId;
  }

  getSupplierName(): string {
    return this._nameSup;
  }

  getProducts(): Product[] {
    return this._products;
  }

  getSupplierProduct(productId: number): SupplierProduct {
    return this._supplierProducts.get(productId); //TODO possible exception.
  }

  getTotalPrice(): number {
    return this._totalPrice;
  }

  getDistance(): number {
    return this._distance;
  }
}
