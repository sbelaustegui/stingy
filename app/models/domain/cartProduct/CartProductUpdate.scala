package models.domain.cartProduct

import play.api.libs.json.{Json, OFormat}

case class CartProductUpdate(id: Long, cartId: Option[Long], supplierProductId: Option[Long]) {
  def toCartProduct(cartProduct: CartProduct): CartProduct = {
    CartProduct(
      Option(id),
      cartProduct.cartId,
      cartProduct.supplierProductId
    )
  }
}

object CartProductUpdate extends CartProductUpdateJsonFormat

trait CartProductUpdateJsonFormat{
  implicit val cartProductUpdateJsonFormat: OFormat[CartProductUpdate] = Json.format[CartProductUpdate]
}
