package models.domain.admin

import play.api.libs.json.{Json, OFormat}
import utils.Encrypter

case class AdminCreate(name: String, lastName: String, email: String, username: String, password: String){
  def toAdmin = Admin(None,name, lastName,email, username,Encrypter.encrypt(password))
}

object AdminCreate extends AdminCreateJsonFormat

trait AdminCreateJsonFormat {
  implicit val adminCreateJsonFormat: OFormat[AdminCreate] = Json.format[AdminCreate]
}