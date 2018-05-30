import {DateModel} from "./date-model";

export class Product {

  static empty(): Product {
    return new Product('', '', '', undefined, false, undefined, undefined)
  }

  public static from(jsonObject: any): Product {
    if (!jsonObject || !jsonObject.name || !jsonObject.imageUrl || !jsonObject.description ||  !jsonObject.uploadDate || jsonObject.isValidated === undefined || !jsonObject.userId || !jsonObject.subcategoryId) {
      throw new Error('Failed to instantiate Product from given jsonObject');
    }
    return new Product(jsonObject.name, jsonObject.imageUrl, jsonObject.description, DateModel.from(jsonObject.uploadDate), jsonObject.isValidated, jsonObject.userId, jsonObject.subcategoryId, jsonObject.id);
  }

  constructor(public name: string, public imageUrl: string, public description: string,
              public uploadDate: DateModel, public isValidated: boolean,
              public userId: number, public subcategoryId: number,
              public id?: number) {
  }
}
