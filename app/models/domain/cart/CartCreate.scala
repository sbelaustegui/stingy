package models.domain.cart

import models.ebean.{Cart => ECart}
import play.api.libs.json.{Json, OFormat}

case class CartCreate(userId: Long)

object CartCreate extends CartCreateJsonFormat{
}

trait CartCreateJsonFormat{
  implicit val cartFormat: OFormat[CartCreate] = Json.format[CartCreate]
}
