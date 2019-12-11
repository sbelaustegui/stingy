package models.domain.product.productImage

import models.dao.ProductImageDAO
import models.domain.image.Image
import models.domain.product.Product
import play.api.libs.json.{Json, OFormat}
import models.ebean.{ProductImage => EProductImage}


case class ProductImage(id: Option[Long], product: Product, image: Image)

object ProductImage extends ProductImageFormat {
  def apply(eProductImage: EProductImage): ProductImage = {
    ProductImage(Some(eProductImage.getId), Product(eProductImage.getProduct), Image(eProductImage.getImage))
  }

  def delete(productImage: ProductImage): Option[Boolean] = {
    ProductImageDAO.delete(productImage)
  }

  def getById(id: Long): Option[ProductImage] = {
    ProductImageDAO.getById(id)
  }

  def getByProductId(id: Long): Option[ProductImage] = {
    ProductImageDAO.getByProductId(id)
  }
}

trait ProductImageFormat {
  implicit val format: OFormat[ProductImage] = Json.format
}
