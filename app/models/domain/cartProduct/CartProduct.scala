package models.domain.cartProduct

import models.dao.CartProductDAO
import models.ebean.{CartProduct => ECartProduct}
import play.api.libs.json.{Json, OFormat}

case class CartProduct(id: Option[Long], cartId: Long, productId: Long) {
  def equals(cartProduct: CartProduct): Boolean = {
    if(cartProduct.id.isDefined && id.isDefined) id.get.equals(cartProduct.id.get)
    else false
  }
}

object CartProduct extends CartProductJsonFormat {

  def apply(cartProduct: ECartProduct): CartProduct = {
    CartProduct(
      Option(cartProduct.getId),
      cartProduct.getCart.getId,
      cartProduct.getProduct.getId
    )
  }

  def apply(cartProductCreate: CartProductCreate): CartProduct = {
    CartProduct(
      None,
      cartProductCreate.cartId,
      cartProductCreate.productId
    )
  }

  def saveOrUpdate(cartProduct: CartProduct): Option[CartProduct] = {
    CartProductDAO.saveOrUpdate(cartProduct)
  }

  def getById(id : Long) : Option[CartProduct] = {
    CartProductDAO.getById(id)
  }

  def getAll: List[CartProduct] = {
    CartProductDAO.getAllCartProducts
  }

  def delete(cartProduct: CartProduct): Option[Boolean] = {
    CartProductDAO.delete(cartProduct)
  }

}

trait CartProductJsonFormat{
  implicit val cartProductFormat: OFormat[CartProduct] = Json.format[CartProduct]
}
