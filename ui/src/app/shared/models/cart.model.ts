import {DateModel} from "./date-model";

export class Cart{

  public static from(jsonObject: any): Cart {
    if (!jsonObject || !jsonObject.userId || !jsonObject.date) {
      throw new Error('Failed to instantiate SupplierProduct from given jsonObject');
    }
    return new Cart(jsonObject.userId, jsonObject.current, DateModel.from(jsonObject.date), jsonObject.id);
  }

  static empty(): Cart{
    return new Cart( undefined, undefined, DateModel.empty())
  }

  constructor(public userId: number, public current: number, public date: DateModel, public id?: number) {}
}
