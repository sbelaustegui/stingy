package models.domain.category

import models.dao.CategoryDAO
import models.ebean.{Category => ECategory}
import play.api.libs.json.{Json, OFormat}

case class Category(id: Option[Long], name: String) {
  def equals(category: Category): Boolean = {
    if(category.id.isDefined && id.isDefined) id.get.equals(category.id.get)
    else false
  }
}

object Category extends CategoryJsonFormat {

  def apply(category: ECategory): Category = {
    Category(
      Option(category.getId),
      category.getName,
    )
  }

  def apply(categoryCreate: CategoryCreate): Category = {
    Category(
      None,
      categoryCreate.name,
    )
  }

  def saveOrUpdate(category: Category): Option[Category] = {
    CategoryDAO.saveOrUpdate(category)
  }

  def getById(id : Long) : Option[Category] = {
    CategoryDAO.getById(id)
  }

  def getAll: List[Category] = {
    CategoryDAO.getAllCategories
  }

  def delete(category: Category): Option[Boolean] = {
    CategoryDAO.delete(category)
  }

}

trait CategoryJsonFormat{
  implicit val categoryFormat: OFormat[Category] = Json.format[Category]
}
