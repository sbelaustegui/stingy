package models.domain.user

import models.dao.UserDAO
import models.domain.authentication.UserLogin
import models.domain.supplier.location.Location
import models.ebean.{User => EUser}
import play.api.libs.json.{Json, OFormat}
import utils.Encrypter

case class User(id: Option[Long], name: String, lastName: String, email: String, username: String, password: String, location: Option[Location]) {
  def equals(user: User): Boolean = {
    if(user.id.isDefined && id.isDefined) id.get.equals(user.id.get)
    else false
  }
}

object User extends UserJsonFormat {

  def apply(user: EUser): User = {
    User(
      Option(user.getId),
      user.getName,
      user.getLastName,
      user.getEmail,
      user.getUsername,
      user.getPassword,
      if(user.getLocation != null) Option(Location.apply(user.getLocation)) else None
    )
  }

  def saveOrUpdate(user: User): Option[User] = {
    UserDAO.saveOrUpdate(user)
  }

  def authenticate(userLogin: UserLogin): Option[User] = {
    UserDAO.authenticate(userLogin.username, userLogin.password)
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

  def getById(id : Long) : Option[User] = {
    UserDAO.getById(id)
  }

  def getByUsername(username: String): Option[User] = {
    UserDAO.getByUsername(username)
  }

  def getAll: List[User] = {
    UserDAO.getAllUsers
  }

  def getByEmail(email: String): Option[User] = {
    UserDAO.getByEmail(email)
  }

  def delete(user: User): Option[Boolean] = {
    UserDAO.delete(user)
  }

}

trait UserJsonFormat{
  implicit val userFormat: OFormat[User] = Json.format[User]
}
