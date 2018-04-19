import {DateModel} from "./date-model";

export class Product{

  static empty(): Product{
    return new Product('', '', '', undefined, DateModel.empty(), false, undefined, undefined, undefined)
  }
  constructor(public name: string, public imageUrl: string, public description: string, public price: number, public uploadDate: DateModel, public isValidated: boolean, public supplierId: number, public userId: number, public subcategoryId: number, public id?: number, public  updateDate?: DateModel) {}
}
