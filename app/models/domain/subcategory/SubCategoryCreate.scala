package models.domain.subcategory

import models.ebean.{SubCategory => ESubCategory}
import play.api.libs.json.{Json, OFormat}

case class SubcategoryCreate(name: String)

object SubcategoryCreate extends SubcategoryCreateJsonFormat{
  def apply(category: ESubCategory): Subcategory = {
    Subcategory(
      Option(category.getId),
      category.getName
    )
  }
}

trait SubcategoryCreateJsonFormat{
  implicit val categoryFormat: OFormat[SubcategoryCreate] = Json.format[SubcategoryCreate]
}
