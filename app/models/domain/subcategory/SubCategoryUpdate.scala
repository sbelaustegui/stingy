package models.domain.subcategory

import play.api.libs.json.{Json, OFormat}

case class SubcategoryUpdate(id: Long, name: Option[String], categoryId: Option[Long]) {
  def toSubcategory(category: Subcategory): Subcategory = {
    Subcategory(
      Option(id),
      name.getOrElse(category.name),
      categoryId.getOrElse(category.categoryId)
    )
  }
}

object SubcategoryUpdate extends SubcategoryUpdateJsonFormat

trait SubcategoryUpdateJsonFormat{
  implicit val categoryUpdateJsonFormat: OFormat[SubcategoryUpdate] = Json.format[SubcategoryUpdate]
}
