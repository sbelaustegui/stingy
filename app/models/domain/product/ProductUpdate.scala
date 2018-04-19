package models.domain.product

import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class ProductUpdate(id: Long, name: Option[String], imageUrl: Option[String], description: Option[String], price: Option[Double], isValidated: Option[Boolean], supplierId: Option[Long], userId: Option[Long], subcategoryId: Option[Long]) {
  def toProduct(product: Product): Product = {
    Product(
      Some(id),
      name.getOrElse(product.name),
      imageUrl.getOrElse(product.imageUrl),
      description.getOrElse(product.description),
      price.getOrElse(product.price),
      Some(Date.now),
      product.uploadDate,
      isValidated.getOrElse(product.isValidated),
      supplierId.getOrElse(product.supplierId),
      userId.getOrElse(product.userId),
      subcategoryId.getOrElse(product.subcategoryId)
    )
  }
}

object ProductUpdate extends ProductUpdateJsonFormat

trait ProductUpdateJsonFormat{
  implicit val productUpdateJsonFormat: OFormat[ProductUpdate] = Json.format[ProductUpdate]
}
