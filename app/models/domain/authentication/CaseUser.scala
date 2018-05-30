package models.domain.authentication

import models.domain.abstractUser.AbstractUser
import models.domain.admin.Admin
import models.domain.user.User
import play.api.libs.json.{Json, OFormat}

case class CaseUser(id: Long, name: String, email: String, userType: Option[String] = None, locationId: Option[Long])

object CaseUser extends CaseUserJsonFormat{
  def toCaseUser(user: AbstractUser) : CaseUser = {
    CaseUser(
      user.id.get,
      user.name,
      user.email,
      AbstractUser.getUserType(user),
      User.getById(user.id.get).get.location match {
        case Some(loc) =>
          loc.id
        case None =>
          None
      }
    )
  }

  def toCaseUser(user: Admin) : CaseUser = {
    CaseUser(
      user.id.get,
      user.name,
      user.email,
      Some(AbstractUser.ADMIN_TYPE),
      None
    )
  }

  def toCaseUser(user: User) : CaseUser = {
    CaseUser(
      user.id.get,
      user.name,
      user.email,
      Some(AbstractUser.USER_TYPE),
      User.getById(user.id.get).get.location match {
        case Some(loc) =>
          loc.id
        case None =>
          None
      }
    )
  }
}

trait CaseUserJsonFormat{
  implicit val caseUserFormat: OFormat[CaseUser] = Json.format[CaseUser]
}
