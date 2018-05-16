package models.domain.product.productImage

import models.domain.image.Image
import models.domain.product.Product
import play.api.libs.json.{Json, OFormat}

case class ProductImageCreate(productId: Long) {
  def toProductImage(product: Product, image: Image): ProductImage = {
    ProductImage(None, product, image)
  }
}

object ProductImageCreate {
  implicit val format: OFormat[ProductImageCreate] = Json.format
}
