package models.domain.product

import play.api.libs.json.{Json, OFormat}

case class ProductStatistics(uploaded: Long, validated: Long)

object ProductStatistics extends ProductStatisticsJsonFormat{
}

trait ProductStatisticsJsonFormat{
  implicit val productStatisticsFormat: OFormat[ProductStatistics] = Json.format[ProductStatistics]
}
