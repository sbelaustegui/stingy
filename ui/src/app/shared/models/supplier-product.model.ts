export class SupplierProduct {

  static empty(): SupplierProduct {
    return new SupplierProduct(undefined, undefined, undefined)
  }

  public static from(jsonObject: any): SupplierProduct {
    if (!jsonObject || !jsonObject.supplierId || !jsonObject.productId || !jsonObject.price) {
      throw new Error('Failed to instantiate SupplierProduct from given jsonObject');
    }
    return new SupplierProduct(jsonObject.supplierId, jsonObject.productId, jsonObject.price, jsonObject.date, jsonObject.id);
  }

  constructor(public supplierId: number, public productId: number, public price: number, public date?: Date, public id?: number) {
  }
}