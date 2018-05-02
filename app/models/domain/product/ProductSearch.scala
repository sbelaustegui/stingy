package models.domain.product

import play.api.libs.json.{Json, OFormat}

case class ProductSearch(name: String, subcategoryId: Long)

object ProductSearch extends ProductSearchJsonFormat{
}

trait ProductSearchJsonFormat{
  implicit val productFormat: OFormat[ProductSearch] = Json.format[ProductSearch]
}
