package models.domain.supplier.location

import models.dao.SupplierLocationDAO
import models.ebean.{SupplierLocation => ESupplierLocation}
import play.api.libs.json.{Json, OFormat}

case class SupplierLocation(id: Option[Long], longitude: Double, latitude: Double) {
  def equals(supplierLocation: SupplierLocation): Boolean = {
    if(supplierLocation.id.isDefined && id.isDefined) id.get.equals(supplierLocation.id.get)
    else false
  }
}

object SupplierLocation extends SupplierLocationJsonFormat {

  def apply(supplierLocation: ESupplierLocation): SupplierLocation = {
    SupplierLocation(
      Option(supplierLocation.getId),
      supplierLocation.getLongitude,
      supplierLocation.getLatitude
    )
  }

  def apply(supplierLocationCreate: SupplierLocationCreate): SupplierLocation = {
    SupplierLocation(
      None,
      supplierLocationCreate.longitude,
      supplierLocationCreate.latitude
    )
  }

  def saveOrUpdate(supplierLocation: SupplierLocation): Option[SupplierLocation] = {
    SupplierLocationDAO.saveOrUpdate(supplierLocation)
  }

  def delete(supplierLocation: SupplierLocation): Option[Boolean] = {
    SupplierLocationDAO.delete(supplierLocation)
  }

  def getById(id: Long): Option[SupplierLocation] = {
    SupplierLocationDAO.getById(id)
  }

}

trait SupplierLocationJsonFormat{
  implicit val supplierLocationFormat: OFormat[SupplierLocation] = Json.format[SupplierLocation]
}
