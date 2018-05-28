export class SupplierProductLocation {

  static empty(): SupplierProductLocation {
    return new SupplierProductLocation(undefined, undefined)
  }

  public static from(jsonObject: any): SupplierProductLocation {
    if (!jsonObject || !jsonObject.userId || !jsonObject.productId) {
      throw new Error('Failed to instantiate SupplierProduct from given jsonObject');
    }
    return new SupplierProductLocation(jsonObject.userId, jsonObject.productId);
  }

  constructor(public userId: number, public productId: number) {
  }
}
