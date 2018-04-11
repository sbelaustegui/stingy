class Category{

  static empty(): Category{
    return new Category('')
  }
  constructor(public name: string, public id?: number) {}
}
