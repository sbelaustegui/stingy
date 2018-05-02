
export class ProductSearch{

  static empty(): ProductSearch{
    return new ProductSearch('', undefined)
  }
  constructor(public name: string, public subcategoryId: number) {}
}
