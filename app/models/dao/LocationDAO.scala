package models.dao

import models.domain.location.Location
import models.ebean.{Location => ELocation}
import utils.ScalaOptional.toScalaOption


/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object LocationDAO {

  def toEbean(location: Location): ELocation = {
    new ELocation(
      if(location.id.isDefined) location.id.get else null,
      location.longitude,
      location.latitude
    )
  }

  def saveOrUpdate(location: Location): Option[Location] = {
    location.id match {
      case Some(_) =>
        val eLocation: ELocation = toEbean(location)
        eLocation.update()
        Some(Location(eLocation))
      case None =>
        val eLocation: ELocation = toEbean(location)
        eLocation.save()
        Some(Location(eLocation))
    }
  }

  def getById(id: Long) : Option[Location] = {
    toScalaOption(ELocation.getLocationById(id)) match {
      case Some(supplier) =>
        Some(Location(supplier))
      case None =>
        None
    }
  }

  def delete(location: Location): Option[Boolean] = {
    location.id match {
      case Some(_) =>
        val eLocation: ELocation = toEbean(location)
        eLocation.delete()
        Some(true)
      case None =>
        None
    }
  }
}
