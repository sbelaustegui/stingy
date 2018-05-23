package models.domain.product

import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class ProductUpdate(id: Long, name: Option[String], imageUrl: Option[String], description: Option[String], isValidated: Option[Boolean], userId: Option[Long], subcategoryId: Option[Long]) {
  def toProduct(product: Product): Product = {
    Product(
      Some(id),
      name.getOrElse(product.name),
      imageUrl.getOrElse(product.imageUrl),
      description.getOrElse(product.description),
      product.uploadDate,
      isValidated.getOrElse(product.isValidated),
      userId.getOrElse(product.userId),
      subcategoryId.getOrElse(product.subcategoryId)
    )
  }
}

object ProductUpdate extends ProductUpdateJsonFormat

trait ProductUpdateJsonFormat{
  implicit val productUpdateJsonFormat: OFormat[ProductUpdate] = Json.format[ProductUpdate]
}
