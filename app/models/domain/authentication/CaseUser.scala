package models.domain.authentication

import models.domain.user.User
import play.api.libs.json.{Json, OFormat}

case class CaseUser(id: Long, name: String, username: String)

object CaseUser extends CaseUserJsonFormat {
  def toCaseUser(user: User): CaseUser = {
    CaseUser(
      user.id.get,
      user.name,
      user.username
    )
  }
}

trait CaseUserJsonFormat {
  implicit val caseUserFormat: OFormat[CaseUser] = Json.format[CaseUser]
}
