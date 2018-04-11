package models.domain.category

import play.api.libs.json.{Json, OFormat}

case class CategoryUpdate(id: Long, name: Option[String]) {
  def toCategory(category: Category): Category = {
    Category(
      Option(id),
      name.getOrElse(category.name)
    )
  }
}

object CategoryUpdate extends CategoryUpdateJsonFormat

trait CategoryUpdateJsonFormat{
  implicit val categoryUpdateJsonFormat: OFormat[CategoryUpdate] = Json.format[CategoryUpdate]
}
