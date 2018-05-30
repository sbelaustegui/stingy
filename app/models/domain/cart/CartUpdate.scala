package models.domain.cart

import play.api.libs.json.{Json, OFormat}

case class CartUpdate(id: Long, userId: Long) {
  def toCart(cart: Cart): Cart = {
    Cart(
      Option(id),
      cart.userId,
      cart.current,
      cart.date
    )
  }
}

object CartUpdate extends CartUpdateJsonFormat

trait CartUpdateJsonFormat{
  implicit val cartUpdateJsonFormat: OFormat[CartUpdate] = Json.format[CartUpdate]
}
