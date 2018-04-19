package models.domain.subcategory

import models.dao.SubcategoryDAO
import models.ebean.{SubCategory => ESubcategory}
import play.api.libs.json.{Json, OFormat}

case class Subcategory(id: Option[Long], name: String, categoryId: Long) {
  def equals(subcategory: Subcategory): Boolean = {
    if(subcategory.id.isDefined && id.isDefined) id.get.equals(subcategory.id.get)
    else false
  }
}

object Subcategory extends SubcategoryJsonFormat {

  def apply(subcategory: ESubcategory): Subcategory = {
    Subcategory(
      Option(subcategory.getId),
      subcategory.getName,
      subcategory.getCategoryId
    )
  }

  def apply(subcategoryCreate: SubcategoryCreate): Subcategory = {
    Subcategory(
      None,
      subcategoryCreate.name,
      subcategoryCreate.categoryId
    )
  }

  def saveOrUpdate(subcategory: Subcategory): Option[Subcategory] = {
    SubcategoryDAO.saveOrUpdate(subcategory)
  }

  def getById(id : Long) : Option[Subcategory] = {
    SubcategoryDAO.getById(id)
  }

  def getByCategoryId(id : Long) : List[Subcategory] = {
    SubcategoryDAO.getByCategoryId(id)
  }

  def getAll: List[Subcategory] = {
    SubcategoryDAO.getAllCategories
  }

  def delete(subcategory: Subcategory): Option[Boolean] = {
    SubcategoryDAO.delete(subcategory)
  }

}

trait SubcategoryJsonFormat{
  implicit val subcategoryFormat: OFormat[Subcategory] = Json.format[Subcategory]
}
