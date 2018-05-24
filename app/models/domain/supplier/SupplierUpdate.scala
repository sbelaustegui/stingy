package models.domain.supplier

import models.domain.supplier.location.Location
import play.api.libs.json.{Json, OFormat}

case class SupplierUpdate(id: Long, name: Option[String], description: Option[String], location: Option[Location]) {
  def toSupplier(supplier: Supplier): Supplier = {
    Supplier(
      Option(id),
      name.getOrElse(supplier.name),
      description.getOrElse(supplier.description),
      location.getOrElse(supplier.location)
    )
  }
}

object SupplierUpdate extends SupplierUpdateJsonFormat

trait SupplierUpdateJsonFormat{
  implicit val supplierUpdateJsonFormat: OFormat[SupplierUpdate] = Json.format[SupplierUpdate]
}
