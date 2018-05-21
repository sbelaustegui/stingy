export class CartProduct{

  static empty(): CartProduct{
    return new CartProduct( undefined, undefined, undefined)
  }
  constructor(public userId: number ,public productId: number ,public id?: number) {}
}
