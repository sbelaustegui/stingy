package models.domain.cartProduct

import models.ebean.{CartProduct => ECartProduct}
import play.api.libs.json.{Json, OFormat}

case class CartProductCreate(cartId: Long, supplierProductId: Long)

object CartProductCreate extends CartProductCreateJsonFormat{
  def apply(cartProduct: ECartProduct): CartProduct = {
    CartProduct(
      Option(cartProduct.getId),
      cartProduct.getCart.getId,
      cartProduct.getSupplierProduct.getId
    )
  }
}

trait CartProductCreateJsonFormat{
  implicit val cartProductFormat: OFormat[CartProductCreate] = Json.format[CartProductCreate]
}
