package models.dao

import models.domain.admin.Admin
import models.ebean.{Admin => EAdmin}
import utils.ScalaOptional.toScalaOption
import scala.collection.JavaConversions._

object AdminDAO {

  def toEbean(admin: Admin): EAdmin = {
    new EAdmin(
      if(admin.id.isDefined) admin.id.get else null,
      admin.name,
      admin.lastName,
      admin.email,
      admin.username,
      admin.password
    )
  }

  def getById(id: Long): Option[Admin] = {
    toScalaOption[EAdmin](EAdmin.getById(id)).map(Admin.apply)
  }

  def getByEmail(email: String): Option[Admin] = {
    toScalaOption[EAdmin](EAdmin.getByEmail(email)).map(Admin.apply)
  }

  def authenticate(username: String, password: String): Option[Admin] = {
    toScalaOption(EAdmin.authenticate(username, password)).map(Admin.apply)
  }

  def saveOrUpdate(admin: Admin): Admin = {
    admin.id match {
      case Some(id) =>
        val valEbean = toEbean(admin)
        valEbean.update()
        Admin(valEbean)
      case None =>
        val valEbean = toEbean(admin)
        valEbean.save()
        Admin(valEbean)
    }
  }

  def delete(admin: Admin): Option[Boolean] = {
    admin.id match {
      case Some(_) =>
        val eAdmin: EAdmin = toEbean(admin)
        eAdmin.delete()
        Some(true)
      case None => None
    }
  }

  def getAll: List[Admin] = {
    EAdmin.getAll.map(Admin.apply).toList
  }
}
