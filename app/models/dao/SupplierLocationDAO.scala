package models.dao

import models.domain.supplier.Supplier
import models.domain.supplier.location.SupplierLocation
import models.ebean.{SupplierLocation => ESupplierLocation}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object SupplierLocationDAO {

  def toEbean(supplierLocation: SupplierLocation): ESupplierLocation = {
    new ESupplierLocation(
      if(supplierLocation.id.isDefined) supplierLocation.id.get else null,
      supplierLocation.longitude,
      supplierLocation.latitude
    )
  }

  def saveOrUpdate(supplierLocation: SupplierLocation): Option[SupplierLocation] = {
    supplierLocation.id match {
      case Some(_) =>
        val eSupplierLocation: ESupplierLocation = toEbean(supplierLocation)
        eSupplierLocation.update()
        Some(SupplierLocation(eSupplierLocation))
      case None =>
        val eSupplierLocation: ESupplierLocation = toEbean(supplierLocation)
        eSupplierLocation.save()
        Some(SupplierLocation(eSupplierLocation))
    }
  }

  def getById(id: Long) : Option[SupplierLocation] = {
    toScalaOption(ESupplierLocation.getSupplierLocationById(id)) match {
      case Some(supplier) =>
        Some(SupplierLocation(supplier))
      case None =>
        None
    }
  }

  def delete(supplierLocation: SupplierLocation): Option[Boolean] = {
    supplierLocation.id match {
      case Some(_) =>
        val eSupplierLocation: ESupplierLocation = toEbean(supplierLocation)
        eSupplierLocation.delete()
        Some(true)
      case None =>
        None
    }
  }
}
