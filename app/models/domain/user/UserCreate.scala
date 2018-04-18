package models.domain.user

import models.ebean.{User => EUser}
import play.api.libs.json.{Json, OFormat}

case class UserCreate(name: String, lastName: String, email: String, username: String, password: String)

object UserCreate extends UserCreateJsonFormat{
  def apply(user: EUser): User = {
    User(
      Option(user.getId),
      user.getName,
      user.getLastName,
      user.getEmail,
      user.getUsername,
      user.getPassword,
      Option(user.getUserId)
    )
  }
}

trait UserCreateJsonFormat{
  implicit val userFormat: OFormat[UserCreate] = Json.format[UserCreate]
}
