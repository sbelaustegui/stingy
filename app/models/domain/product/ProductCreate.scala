package models.domain.product

import models.domain.util.Date
import models.ebean.{Product => EProduct}
import play.api.libs.json.{Json, OFormat}

case class ProductCreate(name: String, imageUrl: Option[String], description: String, isValidated: Boolean, supplierId: Long, userId: Long, subcategoryId: Long)

object ProductCreate extends ProductCreateJsonFormat{
  def apply(product: EProduct): Product = {
    Product(
      Option(product.getId),
      product.getName,
      product.getImageUrl,
      product.getDescription,
      Date.now,
      product.isValidated,
      product.getSupplierId,
      product.getUserId,
      product.getSubcategoryId
    )
  }
}

trait ProductCreateJsonFormat{
  implicit val productFormat: OFormat[ProductCreate] = Json.format[ProductCreate]
}
