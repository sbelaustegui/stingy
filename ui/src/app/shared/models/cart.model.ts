export class Cart{

  static empty(): Cart{
    return new Cart( undefined, undefined)
  }
  constructor(public userId: number ,public id?: number) {}
}
