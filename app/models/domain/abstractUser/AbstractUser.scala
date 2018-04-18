package models.domain.abstractUser

import models.dao.AbstractUserDAO
import models.domain.authentication.UserLogin
import models.ebean.{AbstractUser => EAbstractUser}
import play.api.libs.json.{Json, OFormat}

case class AbstractUser(id: Option[Long], name: String, email: String, password: String)

object AbstractUser extends UserJsonFormat{

  val ADMIN_TYPE = "ADMIN"
  val USER_TYPE = "USER"

  def getUserType(user: AbstractUser): Option[String] = {
    AbstractUserDAO.getUserType(user)
  }

  def apply(user: EAbstractUser): AbstractUser = {
    AbstractUser(
      Option(user.getId),
      user.getName,
      user.getEmail,
      user.getPassword
    )
  }

  def authenticate(userLogin: UserLogin): Option[AbstractUser] = {
    AbstractUserDAO.authenticate(userLogin.username, userLogin.password)
  }

  def getById(id : Long) : Option[AbstractUser] = {
    AbstractUserDAO.getById(id)
  }

  def getByEmail(email: String): Option[AbstractUser] = {
    AbstractUserDAO.getByEmail(email)
  }

  def checkEmail(id: Long, email: String): Boolean = {
    getByEmail(email) match {
      case Some(user) =>
        if(id == user.id.get) {
          true
        } else false
      case None => true
    }
  }
}

trait UserJsonFormat{
  implicit val userFormat: OFormat[AbstractUser] = Json.format[AbstractUser]
}
