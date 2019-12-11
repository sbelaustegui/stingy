package models.domain.location

import models.ebean.{Location => ELocation}
import play.api.libs.json.{Json, OFormat}

case class LocationUserCreate(longitude: Double, latitude: Double, userId: Long)

object LocationUserCreate extends LocationUserCreateJsonFormat{
}

trait LocationUserCreateJsonFormat{
  implicit val locationUserCreateFormat: OFormat[LocationUserCreate] = Json.format[LocationUserCreate]
}
