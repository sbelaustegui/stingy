package models.domain.statistics
import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class ProductPriceWithDate(productId: Long, date: Date, price: Double)

object ProductPriceWithDate extends ProductPriceWithDateJsonFormat {}

trait ProductPriceWithDateJsonFormat{
  implicit val productPriceWithDateFormat: OFormat[ProductPriceWithDate] = Json.format[ProductPriceWithDate]
}
