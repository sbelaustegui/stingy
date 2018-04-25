export class Subcategory{

  static empty(): Subcategory{
    return new Subcategory('', undefined)
  }
  constructor(public name: string, public categoryId: number, public id?: number) {}
}
