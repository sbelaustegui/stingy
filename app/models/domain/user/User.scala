package models.domain.user

import models.dao.UserDAO
import models.ebean.{User => EUser}
import play.api.libs.json.{Json, OFormat}

case class User(id: Option[Long], name: String, lastName: String, email: String, username: String, password: String) {
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
    )
  }

  def apply(userCreate: UserCreate): User = {
    User(
      None,
      userCreate.name,
      userCreate.lastName,
      userCreate.email,
      userCreate.username,
      userCreate.password
    )
  }

  def saveOrUpdate(user: User): Option[User] = {
    UserDAO.saveOrUpdate(user)
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
