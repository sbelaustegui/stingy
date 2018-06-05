import {DateModel} from "./date-model";

export class SupplierProductCart {

  static empty(): SupplierProductCart {
    return new SupplierProductCart('', '', undefined, DateModel.empty(), undefined)
  }

  public static from(jsonObject: any): SupplierProductCart {
    if (!jsonObject || !jsonObject.supplierId || !jsonObject.productId || !jsonObject.price) {
      throw new Error('Failed to instantiate SupplierProduct from given jsonObject');
    }
    return new SupplierProductCart(jsonObject.supplierId, jsonObject.productId, jsonObject.price, DateModel.dateModelFromDate(jsonObject.date), jsonObject.id);
  }

  constructor(public supplier: string, public product: string, public price: number, public date: DateModel, public id: number) {
  }
}
