package models.dao

import models.domain.cart.Cart
import models.ebean.{User, Cart => ECart}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object CartDAO {

  def toEbean(cart: Cart): ECart = {
    new ECart(
      if(cart.id.isDefined) cart.id.get else null,
      User.getById(cart.userId).get(),
      cart.current,
      cart.date.toDateTime
    )
  }

  def saveOrUpdate(cart: Cart): Option[Cart] = {
    cart.id match {
      case Some(_) =>
        val eCart: ECart = toEbean(cart)
        eCart.update()
        Some(Cart(eCart))
      case None =>
        val eCart: ECart = toEbean(cart)
        eCart.save()
        Some(Cart(eCart))
    }
  }

  def getById(id: Long) : Option[Cart] = {
    toScalaOption(ECart.getCartById(id)) match {
      case Some(cart) =>
        Some(Cart(cart))
      case None =>
        None
    }
  }

  def getByUserId(id: Long) : Option[Cart] = {
    toScalaOption(ECart.getCartByUserId(id)) match {
      case Some(cart) =>
        Some(Cart(cart))
      case None =>
        None
    }
  }

  def getAllCarts: List[Cart] = {
    ECart.getAllCarts.map(Cart.apply).toList
  }

  def delete(cart: Cart): Option[Boolean] = {
    cart.id match {
      case Some(_) =>
        val eCart: ECart = toEbean(cart)
        eCart.delete()
        Some(true)
      case None =>
        None
    }
  }
}
