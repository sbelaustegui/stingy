package models.domain.product

import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class ProductPrices(productId: Long, from: Date, to: Date)

object ProductPrices extends ProductPricesJsonFormat{
}

trait ProductPricesJsonFormat{
  implicit val productPricesFormat: OFormat[ProductPrices] = Json.format[ProductPrices]
}
