package models.domain.supplierProduct

import play.api.libs.json.{Json, OFormat}

case class SupplierProductLocation(userId: Long, productId: Long) {

}

object SupplierProductLocation {
  implicit val format: OFormat[SupplierProductLocation] = Json.format
}

