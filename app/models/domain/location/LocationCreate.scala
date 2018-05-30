package models.domain.location

import models.ebean.{Location => ELocation}
import play.api.libs.json.{Json, OFormat}

case class LocationCreate(longitude: Double, latitude: Double)

object LocationCreate extends LocationCreateJsonFormat{
  def apply(location: ELocation): Location = {
    Location(
      Option(location.getId),
      location.getLongitude,
      location.getLatitude
    )
  }
}

trait LocationCreateJsonFormat{
  implicit val locationCreateFormat: OFormat[LocationCreate] = Json.format[LocationCreate]
}
