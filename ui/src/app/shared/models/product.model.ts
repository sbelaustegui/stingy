import {DateModel} from "./date-model";

export class Product{

  static empty(): Product{
    return new Product('', '', '', undefined, DateModel.empty(), false, undefined, undefined, undefined)
  }

  public static from(jsonObject: any): Product {
    if (!jsonObject || !jsonObject.name || !jsonObject.imageUrl || !jsonObject.description || !jsonObject.price || !jsonObject.uploadDate || jsonObject.isValidated === undefined || !jsonObject.supplierId || !jsonObject.userId || !jsonObject.subcategoryId) {
      throw new Error('Failed to instantiate Product from given jsonObject');
    }
    return new Product(jsonObject.name, jsonObject.imageUrl, jsonObject.description, jsonObject.price, DateModel.from(jsonObject.uploadDate), jsonObject.isValidated, jsonObject.supplierId, jsonObject.userId, jsonObject.subcategoryId, jsonObject.id, jsonObject.updateDate ? DateModel.from(jsonObject.updateDate) : undefined);
  }

  constructor(public name: string, public imageUrl: string, public description: string, public price: number, public uploadDate: DateModel, public isValidated: boolean, public supplierId: number, public userId: number, public subcategoryId: number, public id?: number, public  updateDate?: DateModel) {}
}
