package models.domain.supplier.location

import play.api.libs.json.{Json, OFormat}

case class SupplierLocationUpdate(id: Long, longitude: Option[Double], latitude: Option[Double]) {
  def toSupplier(supplier: SupplierLocation): SupplierLocation = {
    SupplierLocation(
      Option(id),
      longitude.getOrElse(supplier.longitude),
      latitude.getOrElse(supplier.latitude)
    )
  }
}

object SupplierLocationUpdate extends SupplierLocationUpdateJsonFormat

trait SupplierLocationUpdateJsonFormat{
  implicit val supplierLocationUpdateJsonFormat: OFormat[SupplierLocationUpdate] = Json.format[SupplierLocationUpdate]
}
