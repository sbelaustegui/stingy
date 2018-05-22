package models.domain.supplier.location

import models.ebean.{SupplierLocation => ESupplierLocation}
import play.api.libs.json.{Json, OFormat}

case class SupplierLocationCreate(longitude: Double, latitude: Double)

object SupplierLocationCreate extends SupplierLocationCreateJsonFormat{
  def apply(supplierLocation: ESupplierLocation): SupplierLocation = {
    SupplierLocation(
      Option(supplierLocation.getId),
      supplierLocation.getLongitude,
      supplierLocation.getLatitude
    )
  }
}

trait SupplierLocationCreateJsonFormat{
  implicit val supplierLocationCreateFormat: OFormat[SupplierLocationCreate] = Json.format[SupplierLocationCreate]
}
