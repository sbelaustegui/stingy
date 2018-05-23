package models.dao

import models.domain.supplierProduct.SupplierProduct
import models.ebean.{SupplierProduct => ESupplierProduct}
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
      supplierProduct.date.toDateTime
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

  def getAllSupplierProducts: List[SupplierProduct] = {
    ESupplierProduct.getAllSupplierProducts.map(SupplierProduct.apply).toList
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
