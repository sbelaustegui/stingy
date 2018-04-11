package models.domain.authentication

import play.api.libs.json.{Json, OFormat}

case class UserLogged(caseUser: Option[CaseUser],isLogged: Boolean)

object UserLogged extends UserLoggedJsonFormat

trait UserLoggedJsonFormat{
  implicit val userLoggedFormat: OFormat[UserLogged] = Json.format[UserLogged]
}
