import {DateModel} from "./date-model";

export class CartBagProduct {


  static empty(): CartBagProduct {
    return new CartBagProduct(undefined, undefined, undefined,
      undefined, '',
      '', '')
  }

  public static from(jsonObject: any): CartBagProduct {
    if (!jsonObject || jsonObject.supplierProductId
      || jsonObject.supplierProductDate || jsonObject.supplierProductPrice
      || jsonObject.productDate || jsonObject.productName
      || jsonObject.productDescription || jsonObject.userName) {
      throw new Error('Failed to instantiate SupplierProduct from given jsonObject');
    }
    return new CartBagProduct(jsonObject.supplierProductId, DateModel.from(jsonObject.supplierProductDate),
      jsonObject.supplierProductPrice, DateModel.from(jsonObject.productDate),
      jsonObject.productName, jsonObject.productDescription,
      jsonObject.userName, jsonObject.id);
  }


  constructor(
    public supplierProductId: number,
    public supplierProductDate: DateModel, public supplierProductPrice: number,
    public productDate: DateModel, public productName: string,
    public productDescription: string, public userName: string,
    public id?: number,
  ) {
  }
}
