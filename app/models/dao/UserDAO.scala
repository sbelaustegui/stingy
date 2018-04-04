package models.dao

import models.domain.user.User
import models.ebean.{User => EUser}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object UserDAO {

  def toEbean(user: User): EUser = {
    new EUser(
      if(user.id.isDefined) user.id.get else null,
      user.name,
      user.lastName,
      user.email,
      user.username,
      user.password
    )
  }

  def saveOrUpdate(user: User): Option[User] = {
    user.id match {
      case Some(_) =>
        val eUser: EUser = toEbean(user)
        eUser.update()
        Some(User(eUser))
      case None =>
        val eUser: EUser = toEbean(user)
        eUser.save()
        Some(User(eUser))
    }
  }

  def getById(id: Long) : Option[User] = {
    toScalaOption(EUser.getUserById(id)) match {
      case Some(user) =>
        Some(User(user))
      case None =>
        None
    }
  }

  def getByUsername(username: String): Option[User] = {
    toScalaOption(EUser.getUserByUserName(username)) match {
      case Some(user) =>
        Some(User(user))
      case None =>
        None
    }
  }

  def getAllUsers: List[User] = {
    EUser.getAllUsers.map(User.apply).toList
  }

  def delete(user: User): Option[Boolean] = {
    user.id match {
      case Some(_) =>
        val eUser: EUser = toEbean(user)
        eUser.delete()
        Some(true)
      case None =>
        None
    }
  }

  def getByEmail(email: String): Option[User] = {
    toScalaOption(EUser.getUserByEmail(email)) match {
      case Some(eUser) =>
        Some(User(eUser))
      case None =>
        None
    }
  }
}
