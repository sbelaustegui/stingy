package models.dao

import models.domain.cartProduct.CartProduct
import models.ebean.{Cart, SupplierProduct, CartProduct => ECartProduct}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object CartProductDAO {

  def toEbean(cartProduct: CartProduct): ECartProduct = {
    new ECartProduct(
      if(cartProduct.id.isDefined) cartProduct.id.get else null,
      Cart.getCartById(cartProduct.cartId).get(),
      SupplierProduct.getSupplierProductById(cartProduct.supplierProductId).get
    )
  }

  def saveOrUpdate(cartProduct: CartProduct): Option[CartProduct] = {
    cartProduct.id match {
      case Some(_) =>
        val eCartProduct: ECartProduct = toEbean(cartProduct)
        eCartProduct.update()
        Some(CartProduct(eCartProduct))
      case None =>
        val eCartProduct: ECartProduct = toEbean(cartProduct)
        eCartProduct.save()
        Some(CartProduct(eCartProduct))
    }
  }

  def getById(id: Long) : Option[CartProduct] = {
    toScalaOption(ECartProduct.getCartProductById(id)) match {
      case Some(cartProduct) =>
        Some(CartProduct(cartProduct))
      case None =>
        None
    }
  }

  def getByCartId(id: Long) : List[CartProduct] = {
    ECartProduct.getCartProductsByCartId(id).map(CartProduct.apply).toList
  }

 def hasProduct(productId: Long, cartId: Long) : Boolean = {
    ECartProduct.hasProduct(productId, cartId)
  }

  def getCartProductIdByCartIdAndSupplierProductId(cartId: Long, supplierProductId: Long) : Long = {
    ECartProduct.getCartProductIdByCartIdAndSupplierProductId(cartId, supplierProductId)
  }

  def getAllCartProducts: List[CartProduct] = {
    ECartProduct.getAllCartProducts.map(CartProduct.apply).toList
  }

  def delete(cartProduct: CartProduct): Option[Boolean] = {
    cartProduct.id match {
      case Some(_) =>
        val eCartProduct: ECartProduct = toEbean(cartProduct)
        eCartProduct.delete()
        Some(true)
      case None =>
        None
    }
  }
}
