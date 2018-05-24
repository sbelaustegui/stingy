package models.domain.supplier.location

import models.dao.LocationDAO
import models.ebean.{Location => ELocation}
import play.api.libs.json.{Json, OFormat}

case class Location(id: Option[Long], longitude: Double, latitude: Double) {
  def equals(location: Location): Boolean = {
    if(location.id.isDefined && id.isDefined) id.get.equals(location.id.get)
    else false
  }
}

object Location extends LocationJsonFormat {

  def apply(location: ELocation): Location = {
    Location(
      Option(location.getId),
      location.getLongitude,
      location.getLatitude
    )
  }

  def apply(locationCreate: LocationCreate): Location = {
    Location(
      None,
      locationCreate.longitude,
      locationCreate.latitude
    )
  }

  def saveOrUpdate(location: Location): Option[Location] = {
    LocationDAO.saveOrUpdate(location)
  }

  def delete(location: Location): Option[Boolean] = {
    LocationDAO.delete(location)
  }

  def getById(id: Long): Option[Location] = {
    LocationDAO.getById(id)
  }

}

trait LocationJsonFormat{
  implicit val locationFormat: OFormat[Location] = Json.format[Location]
}
