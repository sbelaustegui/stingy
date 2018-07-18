package models.dao

import models.domain.location.Location
import models.domain.supplierProduct.SupplierProduct
import models.domain.util.Date
import models.ebean.{Location => ELocation, SupplierProduct => ESupplierProduct}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object SupplierProductDAO {

  def toEbean(supplierProduct: SupplierProduct): ESupplierProduct = {
    new ESupplierProduct(
      if(supplierProduct.id.isDefined) supplierProduct.id.get else null,
      supplierProduct.supplierId,
      supplierProduct.productId,
      supplierProduct.price,
      supplierProduct.date.toDateTime,
      supplierProduct.userId
    )
  }

  def saveOrUpdate(supplierProduct: SupplierProduct): Option[SupplierProduct] = {
    supplierProduct.id match {
      case Some(_) =>
        val eSupplierProduct: ESupplierProduct = toEbean(supplierProduct)
        eSupplierProduct.update()
        Some(SupplierProduct(eSupplierProduct))
      case None =>
        val eSupplierProduct: ESupplierProduct = toEbean(supplierProduct)
        eSupplierProduct.save()
        Some(SupplierProduct(eSupplierProduct))
    }
  }

  def getById(id: Long) : Option[SupplierProduct] = {
    toScalaOption(ESupplierProduct.getSupplierProductById(id)) match {
      case Some(supplierProduct) =>
        Some(SupplierProduct(supplierProduct))
      case None =>
        None
    }
  }

  def getBySupplierId(id: Long) : List[SupplierProduct] = {
    ESupplierProduct.getSupplierProductBySupplierId(id).map(SupplierProduct.apply).toList
  }

  def getByProductId(id: Long) : List[SupplierProduct] = {
    ESupplierProduct.getSupplierProductByProductId(id).map(SupplierProduct.apply).toList
  }

  def getByUserId(id: Long) : List[SupplierProduct] = {
    ESupplierProduct.getSupplierProductByUserId(id).map(SupplierProduct.apply).toList
  }

  def getByCartId(id: Long) : List[SupplierProduct] = {
    ESupplierProduct.getSupplierProductByCartId(id).map(SupplierProduct.apply).toList
  }

  def getByLocation(productId: Long, userLocation: Location) : List[SupplierProduct] = {
    ESupplierProduct.getSupplierProductByLocation(productId, ELocation.getLocationById(userLocation.id.get).get()).map(SupplierProduct.apply).toList
  }

  def getAllSupplierProducts: List[SupplierProduct] = {
    ESupplierProduct.getAllSupplierProducts.map(SupplierProduct.apply).toList
  }

  def getPrices(productId: Long, from: Date, to: Date): List[Double] = {
    ESupplierProduct.getSupplierProductByProductIdFromTo(productId, from.toDateTime, to.toDateTime).map(SupplierProduct.apply).map(sp  => sp.price).toList
  }

  def delete(supplierProduct: SupplierProduct): Option[Boolean] = {
    supplierProduct.id match {
      case Some(_) =>
        val eSupplierProduct: ESupplierProduct = toEbean(supplierProduct)
        eSupplierProduct.delete()
        Some(true)
      case None =>
        None
    }
  }
}
