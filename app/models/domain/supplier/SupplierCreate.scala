package models.domain.supplier

import models.domain.supplier.location.{Location, LocationCreate}
import models.ebean.{Supplier => ESupplier}
import play.api.libs.json.{Json, OFormat}

case class SupplierCreate(name: String, description: String, locationId: Long)

object SupplierCreate extends SupplierCreateJsonFormat{
  def apply(supplier: ESupplier): Supplier = {
    Supplier(
      Option(supplier.getId),
      supplier.getName,
      supplier.getDescription,
      LocationCreate(supplier.getLocation)
    )
  }
}

trait SupplierCreateJsonFormat{
  implicit val supplierFormat: OFormat[SupplierCreate] = Json.format[SupplierCreate]
}
