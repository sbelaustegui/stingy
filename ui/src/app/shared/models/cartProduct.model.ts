export class CartProduct{

  static empty(): CartProduct{
    return new CartProduct( undefined, undefined, undefined)
  }
  constructor(public cartId: number ,public supplierProductId: number ,public id?: number) {}
}
