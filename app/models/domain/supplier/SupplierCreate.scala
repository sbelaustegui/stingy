package models.domain.supplier

import models.ebean.{Supplier => ESupplier}
import play.api.libs.json.{Json, OFormat}

case class SupplierCreate(name: String, description: String, location: String)

object SupplierCreate extends SupplierCreateJsonFormat{
  def apply(supplier: ESupplier): Supplier = {
    Supplier(
      Option(supplier.getId),
      supplier.getName,
      supplier.getDescription,
      supplier.getLocation
    )
  }
}

trait SupplierCreateJsonFormat{
  implicit val supplierFormat: OFormat[SupplierCreate] = Json.format[SupplierCreate]
}
