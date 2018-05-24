package models.domain.supplier.location

import play.api.libs.json.{Json, OFormat}

case class LocationUpdate(id: Long, longitude: Option[Double], latitude: Option[Double]) {
  def toSupplier(supplier: Location): Location = {
    Location(
      Option(id),
      longitude.getOrElse(supplier.longitude),
      latitude.getOrElse(supplier.latitude)
    )
  }
}

object LocationUpdate extends LocationUpdateJsonFormat

trait LocationUpdateJsonFormat{
  implicit val locationUpdateJsonFormat: OFormat[LocationUpdate] = Json.format[LocationUpdate]
}
