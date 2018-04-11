package models.domain.category

import models.ebean.{Category => ECategory}
import play.api.libs.json.{Json, OFormat}

case class CategoryCreate(name: String)

object CategoryCreate extends CategoryCreateJsonFormat{
  def apply(user: ECategory): Category = {
    Category(
      Option(user.getId),
      user.getName,
    )
  }
}

trait CategoryCreateJsonFormat{
  implicit val categoryFormat: OFormat[CategoryCreate] = Json.format[CategoryCreate]
}
