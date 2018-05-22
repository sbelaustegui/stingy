package models.domain.supplier

import models.dao.SupplierDAO
import models.domain.supplier.location.SupplierLocation
import models.ebean.{Supplier => ESupplier}
import play.api.libs.json.{Json, OFormat}

case class Supplier(id: Option[Long], name: String, description: String, location: SupplierLocation) {
  def equals(supplier: Supplier): Boolean = {
    if(supplier.id.isDefined && id.isDefined) id.get.equals(supplier.id.get)
    else false
  }
}

object Supplier extends SupplierJsonFormat {

  def apply(supplier: ESupplier): Supplier = {
    Supplier(
      Option(supplier.getId),
      supplier.getName,
      supplier.getDescription,
      SupplierLocation.apply(supplier.getLocation)
    )
  }

  def apply(supplierCreate: SupplierCreate): Supplier = {
    Supplier(
      None,
      supplierCreate.name,
      supplierCreate.description,
      SupplierLocation.getById(supplierCreate.locationId).get
    )
  }

  def saveOrUpdate(supplier: Supplier): Option[Supplier] = {
    SupplierDAO.saveOrUpdate(supplier)
  }

  def getById(id : Long) : Option[Supplier] = {
    SupplierDAO.getById(id)
  }

  def getAll: List[Supplier] = {
    SupplierDAO.getAllSuppliers
  }

  def delete(supplier: Supplier): Option[Boolean] = {
    SupplierDAO.delete(supplier)
  }

}

trait SupplierJsonFormat{
  implicit val supplierFormat: OFormat[Supplier] = Json.format[Supplier]
}
