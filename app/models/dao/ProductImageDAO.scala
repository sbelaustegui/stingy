package models.dao

import models.domain.product.productImage.ProductImage
import models.ebean.{ProductImage => EProductImage}
import utils.ScalaOptional.toScalaOption
import scala.collection.JavaConversions._

object ProductImageDAO {

  def toEbean(productImage: ProductImage): EProductImage = {
    new EProductImage(
      if(productImage.id.isDefined) productImage.id.get else null,
      ProductDAO.toEbean(productImage.product),
      ImageDAO.toEbean(productImage.image)
    )
  }

  def saveOrUpdate(productImage: ProductImage): ProductImage = {
    productImage.id match {
      case Some(_) =>
        val eProductImage = toEbean(productImage)
        eProductImage.update()
        ProductImage(eProductImage)
      case None =>
        val eProductImage = toEbean(productImage)
        eProductImage.save()
        ProductImage(eProductImage)
    }
  }

  def delete(productImage: ProductImage): Option[Boolean] = {
    productImage.id match {
      case Some(_) =>
        ImageDAO.deleteImageFile(productImage.product.name, productImage.image.path.split("/").last)
        val eProductImage: EProductImage = toEbean(productImage)
        eProductImage.delete()
        Some(true)
      case None => None
    }
  }

  def deleteProductImages(productId: Long): Boolean = {
    var result = true
    getProductImages(productId) foreach {image =>
      if(result) {
        delete(image) match {
          case Some(_) =>
          case None => result = false
        }
      }
    }
    result
  }

  def getProductImageAmount(productId: Long): Int = {
    EProductImage.getProductImageAmount(productId)
  }

  def getByImageId(imageId: Long): List[ProductImage] = {
    EProductImage.getByImageId(imageId).map(ProductImage.apply).toList
  }

  def getProductImages(productId: Long): List[ProductImage] = {
    EProductImage.getProductImages(productId).map(ProductImage.apply).toList
  }

  def getById(id: Long): Option[ProductImage] = {
    toScalaOption(EProductImage.getById(id)).map(ProductImage.apply)
  }

  def deleteMultiple(images: List[ProductImage]): Option[Boolean] = {
    var result = true
    images.foreach(image => {
      if(result) {
        delete(image) match {
          case Some(true) =>
          case _ => result = false
        }
      }
    })
    Some(result)
  }
}
