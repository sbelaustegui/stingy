package models.dao

import models.domain.supplier.Supplier
import models.ebean.{Supplier => ESupplier}
import models.ebean.{SupplierLocation => ESupplierLocation}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object SupplierDAO {

  def toEbean(supplier: Supplier): ESupplier = {
    new ESupplier(
      if(supplier.id.isDefined) supplier.id.get else null,
      supplier.name,
      supplier.description,
      new ESupplierLocation(if(supplier.location.id.isDefined) supplier.location.id.get else null, supplier.location.latitude, supplier.location.longitude)
    )
  }

  def saveOrUpdate(supplier: Supplier): Option[Supplier] = {
    supplier.id match {
      case Some(_) =>
        val eSupplier: ESupplier = toEbean(supplier)
        eSupplier.update()
        Some(Supplier(eSupplier))
      case None =>
        val eSupplier: ESupplier = toEbean(supplier)
        eSupplier.save()
        Some(Supplier(eSupplier))
    }
  }

  def getById(id: Long) : Option[Supplier] = {
    toScalaOption(ESupplier.getSupplierById(id)) match {
      case Some(supplier) =>
        Some(Supplier(supplier))
      case None =>
        None
    }
  }

  def getAllSuppliers: List[Supplier] = {
    ESupplier.getAllSuppliers.map(Supplier.apply).toList
  }

  def delete(supplier: Supplier): Option[Boolean] = {
    supplier.id match {
      case Some(_) =>
        val eSupplier: ESupplier = toEbean(supplier)
        eSupplier.delete()
        Some(true)
      case None =>
        None
    }
  }
}
