package models.domain.user

import models.domain.supplier.location.Location
import play.api.libs.json.{Json, OFormat}
import utils.Encrypter

case class  UserCreate(name: String, lastName: String, email: String, username: String, password: String, locationId: Option[Long]){
  def toUser = User(
    None,
    name,
    lastName,
    email,
    username,
    Encrypter.encrypt(password),
    locationId match {
      case Some(lId) =>
        Location.getById(lId)
      case None => None
    }
  )
}

object UserCreate extends UserCreateJsonFormat{}

trait UserCreateJsonFormat{
  implicit val userFormat: OFormat[UserCreate] = Json.format[UserCreate]
}
