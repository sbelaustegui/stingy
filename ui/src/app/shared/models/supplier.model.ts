export class Supplier{

  static empty(): Supplier{
    return new Supplier('', '', '')
  }
  constructor(public name: string, public description: string, public location: string, public id?: number) {}
}
