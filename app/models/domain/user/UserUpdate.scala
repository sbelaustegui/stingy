package models.domain.user

import models.domain.location.Location
import play.api.libs.json.{Json, OFormat}
import utils.Encrypter

case class UserUpdate(id: Long, name: Option[String], username: Option[String], password: Option[String], lastName: Option[String], email: Option[String], location: Option[Location], rate: Option[Double]) {
  def toUser(user: User): User = {
    User(
      Option(id),
      name.getOrElse(user.name),
      lastName.getOrElse(user.lastName),
      email.getOrElse(user.email),
      username.getOrElse(user.username),
      verifyPassword(user.password),
      user.location,
      rate.getOrElse(user.rate)
    )
  }

  def verifyPassword(currentPassword: String) : String = {
    password match {
      case Some(auxPassword) =>
        if(auxPassword.equals(currentPassword)){
          currentPassword
        }else{
          Encrypter.encrypt(auxPassword)
        }
      case None=>
        currentPassword
    }
  }
}

object UserUpdate extends UserUpdateJsonFormat

trait UserUpdateJsonFormat{
  implicit val userUpdateJsonFormat: OFormat[UserUpdate] = Json.format[UserUpdate]
}
