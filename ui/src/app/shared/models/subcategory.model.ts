export class Subcategory{

  static empty(): Subcategory{
    return new Subcategory('')
  }
  constructor(public name: string, public id?: number) {}
}
