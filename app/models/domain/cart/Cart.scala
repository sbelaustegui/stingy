package models.domain.cart

import models.dao.CartDAO
import models.ebean.{Cart => ECart}
import play.api.libs.json.{Json, OFormat}

case class Cart(id: Option[Long], userId: Long) {
  def equals(cart: Cart): Boolean = {
    if(cart.id.isDefined && id.isDefined) id.get.equals(cart.id.get)
    else false
  }
}

object Cart extends CartJsonFormat {

  def apply(cart: ECart): Cart = {
    Cart(
      Option(cart.getId),
      cart.getUser.getId
    )
  }

  def apply(cartCreate: CartCreate): Cart = {
    Cart(
      None,
      cartCreate.userId
    )
  }

  def saveOrUpdate(cart: Cart): Option[Cart] = {
    CartDAO.saveOrUpdate(cart)
  }

  def getById(id : Long) : Option[Cart] = {
    CartDAO.getById(id)
  }

  def getByUserId(id : Long) : Option[Cart] = {
    CartDAO.getByUserId(id)
  }

  def getAll: List[Cart] = {
    CartDAO.getAllCarts
  }

  def delete(cart: Cart): Option[Boolean] = {
    CartDAO.delete(cart)
  }

}

trait CartJsonFormat{
  implicit val cartFormat: OFormat[Cart] = Json.format[Cart]
}
