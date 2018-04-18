package models.domain.admin

import play.api.libs.json.{Json, OFormat}
import utils.Encrypter

case class AdminUpdate(id: Long, name: Option[String], lastName: Option[String], email: Option[String], username: Option[String], password: Option[String]) {

  def verifyPassword(currentPassword: String) : String = {
    password match {
      case Some(auxPassword) =>
        if(auxPassword == currentPassword){
          currentPassword
        }else{
          Encrypter.encrypt(auxPassword)
        }
      case None=>
        currentPassword
    }
  }

  def toAdmin(admin: Admin): Admin = {
    Admin(
      Some(id),
      name.getOrElse(admin.name),
      lastName.getOrElse(admin.lastName),
      email.getOrElse(admin.email),
      username.getOrElse(admin.username),
      verifyPassword(admin.password)
    )
  }
}

object AdminUpdate extends AdminUpdateJsonFormat

trait AdminUpdateJsonFormat {
  implicit val adminUpdateJsonFormat: OFormat[AdminUpdate] = Json.format[AdminUpdate]
}