package models.domain.cartProduct

import play.api.libs.json.{Json, OFormat}

case class CartProductUpdate(id: Long, cartId: Option[Long], productId: Option[Long]) {
  def toCartProduct(cartProduct: CartProduct): CartProduct = {
    CartProduct(
      Option(id),
      cartProduct.cartId,
      cartProduct.productId
    )
  }
}

object CartProductUpdate extends CartProductUpdateJsonFormat

trait CartProductUpdateJsonFormat{
  implicit val cartProductUpdateJsonFormat: OFormat[CartProductUpdate] = Json.format[CartProductUpdate]
}
