package models.dao

import models.domain.admin.Admin
import models.domain.user.User
import models.ebean.{AbstractUser => EAbstractUser}
import models.domain.abstractUser.AbstractUser
import models.domain.abstractUser.AbstractUser.{ADMIN_TYPE, USER_TYPE}
import utils.ScalaOptional.toScalaOption

object AbstractUserDAO {

  def getUserType(user: AbstractUser): Option[String] = {
    user.id match {
      case None =>
        None
      case Some(id) =>
        User.getById(id) match {
          case Some(_)=>
            Some(USER_TYPE)
          case None =>
            Admin.getById(id) match {
              case Some(_) =>
                Some(ADMIN_TYPE)
            }
        }
    }
  }

  def authenticate(username: String, password: String): Option[AbstractUser] = {
    toScalaOption[EAbstractUser](EAbstractUser.authenticateUser(username, password)).map(AbstractUser.apply)
  }

  def getById(id : Long) : Option[AbstractUser] = {
    toScalaOption[EAbstractUser](EAbstractUser.getUserById(id)).map(AbstractUser.apply)
  }

  def getByEmail(email: String): Option[AbstractUser] = {
    toScalaOption[EAbstractUser](EAbstractUser.getUserByEmail(email)).map(AbstractUser.apply)
  }
}
