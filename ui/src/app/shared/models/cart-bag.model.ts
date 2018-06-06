import {Product} from "./product.model";
import {SupplierProduct} from "./supplier-product.model";
import {SupplierProductService} from "../services/supplierProduct.service";
import {ProductService} from "../services/product.service";

export class CartBag {

  private readonly _supplierId: number;
  private readonly _nameSup: string;
  private _products: Product[]; //id as key
  private _supplierProducts: Map<number, SupplierProduct>; // productId as key
  private _totalPrice: number;
  private readonly _distance: number;
  private spService: SupplierProductService;
  private pService: ProductService;


  constructor(public idSupplier: number, public nameSupplier: string, public  distanceToUser: number,
              public supplierProductService: SupplierProductService, public productService: ProductService) {
    this._supplierId = idSupplier;
    this._nameSup = nameSupplier;
    this._distance = distanceToUser;
    this._products = [];
    this._supplierProducts = new Map<number, SupplierProduct>();
    this._totalPrice = 0;
    this.spService = supplierProductService;
    this.pService = productService;
  }


  addProduct(supplierProduct: SupplierProduct){
    this.productService.getProductById(supplierProduct.productId)
      .then( p => {
        this._supplierProducts.set(supplierProduct.productId,supplierProduct);
        this._totalPrice += supplierProduct.price;
        this._products.push(p);

      })
  }

  addSupplierProduct(supplierProduct: SupplierProduct, product: Product) {
    // if (supplierProduct.supplierId == this._supplierId) {
    //   if (product.id == supplierProduct.productId && !this._supplierProducts.has(product.id)) {
    //     this._totalPrice += supplierProduct.price;
    //     this._supplierProducts.set(product.id, supplierProduct);
    //     this._products.push(product);
    //   } else
    //     throw new Error("SupplierProduct doesn't match with id Product or is already loaded!")
    // } else
    //   throw new Error("SupplierProduct doesn't match with id Supplier in CartBag!");
    this._supplierProducts.set(supplierProduct.productId,supplierProduct);
    this._totalPrice += supplierProduct.price;
    this._products.push(product);
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
    return SupplierProduct.from(this._supplierProducts.get(productId)); //TODO possible exception.
  }

  getTotalPrice(): number {
    return this._totalPrice;
  }

  getDistance(): number {
    return this._distance;
  }

}
