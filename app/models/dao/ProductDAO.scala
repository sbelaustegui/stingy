package models.dao

import models.domain.product.Product
import models.domain.product.productImage.ProductImage
import models.ebean.{Product => EProduct}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConverters._
import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object ProductDAO {

  def toEbean(product: Product): EProduct = {
    new EProduct(
      if(product.id.isDefined) product.id.get else null,
      product.name,
      product.imageUrl,
      product.description,
      product.price,
      if(product.updateDate.isDefined) product.updateDate.get.toDateTime else null,
      product.uploadDate.toDateTime,
      product.isValidated,
      product.supplierId,
      product.userId,
      product.subcategoryId
    )
  }

  def saveOrUpdate(product: Product): Option[Product] = {
    product.id match {
      case Some(_) =>
        val eProduct: EProduct = toEbean(product)
        eProduct.update()
        Some(Product(eProduct))
      case None =>
        val eProduct: EProduct = toEbean(product)
        eProduct.save()
        Some(Product(eProduct))
    }
  }

  def getById(id: Long) : Option[Product] = {
    toScalaOption(EProduct.getProductById(id)) match {
      case Some(product) =>
        Some(Product(product))
      case None =>
        None
    }
  }


  def getBySubcategoryId(id: Long) : Option[List[Product]] = {
    toScalaOption(EProduct.getProductBySubcategoryId(id)) match {
      case Some(product) =>
        Some(product.map(Product.apply).toList)
      case None =>
        None
    }
  }

  def getByName(name: String, subcategoryId: Long) : Option[List[Product]] = {
    toScalaOption(EProduct.getByName(name, subcategoryId)) match {
      case Some(product) =>
        Some(product.map(Product.apply).toList)
      case None =>
        None
    }
  }

  def addImage(productImage: ProductImage): ProductImage = {
    ProductImageDAO.saveOrUpdate(productImage)
  }

  def validate(product: Product) : Product = {
    saveOrUpdate(product.copy(isValidated = true)).get
  }

  def getAllProducts: List[Product] = {
    EProduct.getAllProducts.map(Product.apply).toList
  }

  def delete(product: Product): Option[Boolean] = {
    product.id match {
      case Some(_) =>
        val eProduct: EProduct = toEbean(product)
        eProduct.delete()
        Some(true)
      case None =>
        None
    }
  }
}
