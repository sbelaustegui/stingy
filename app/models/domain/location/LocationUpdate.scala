package models.domain.location

import play.api.libs.json.{Json, OFormat}

case class LocationUpdate(id: Long, longitude: Option[Double], latitude: Option[Double]) {
  def toLocation(location: Location): Location = {
    Location(
      Option(id),
      longitude.getOrElse(location.longitude),
      latitude.getOrElse(location.latitude)
    )
  }
}

object LocationUpdate extends LocationUpdateJsonFormat

trait LocationUpdateJsonFormat{
  implicit val locationUpdateJsonFormat: OFormat[LocationUpdate] = Json.format[LocationUpdate]
}
