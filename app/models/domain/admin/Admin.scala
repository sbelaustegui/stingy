package models.domain.admin

import models.dao.AdminDAO
import models.domain.authentication.{CaseUser, UserLogin}
import play.api.libs.json.{Json, OFormat}
import models.ebean.{Admin => EAdmin}
import utils.Encrypter

case class Admin(id: Option[Long], name: String, lastName: String, email: String, username: String, password: String)

object Admin extends AdminJsonFormat {
  def apply(eAdmin: EAdmin): Admin = {
    Admin(
      Option(eAdmin.getId),
      eAdmin.getName,
      eAdmin.getLastName,
      eAdmin.getEmail,
      eAdmin.getUsername,
      eAdmin.getPassword
    )
  }

  def apply(userCreate: AdminCreate): Admin = {
    Admin(
      None,
      userCreate.name,
      userCreate.lastName,
      userCreate.email,
      userCreate.username,
      Encrypter.encrypt(userCreate.password)
    )
  }

  def apply(name: String, lastName: String, email: String, username: String, password: String): Admin = { Admin(None, name, lastName, email, username, password) }

  def isAdmin(userId: Long): Boolean = {
    getById(userId).isDefined
  }

  def isAdmin(user: CaseUser): Boolean = {
    isAdmin(user.id)
  }

  def getById(id: Long): Option[Admin] = {
    AdminDAO.getById(id)
  }

  def getByEmail(email: String): Option[Admin] = {
    AdminDAO.getByEmail(email)
  }

  def authenticate(userLogin: UserLogin): Option[Admin] = {
    AdminDAO.authenticate(userLogin.username ,userLogin.password)
  }

  def saveOrUpdate(admin: Admin): Admin = {
    AdminDAO.saveOrUpdate(admin)
  }

  def delete(admin: Admin): Option[Boolean] = {
    AdminDAO.delete(admin)
  }

  def getAll: List[Admin] = {
    AdminDAO.getAll
  }
}

trait AdminJsonFormat {
  implicit val adminJsonFormat: OFormat[Admin] = Json.format[Admin]
}