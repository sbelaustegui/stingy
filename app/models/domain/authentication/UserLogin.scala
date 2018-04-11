package models.domain.authentication

import play.api.libs.json.{Json, OFormat}

case class UserLogin(username: String, password: String)

object UserLogin extends UserLoginJsonFormat

trait UserLoginJsonFormat{
  implicit val userLoginFormat: OFormat[UserLogin] = Json.format[UserLogin]
}
