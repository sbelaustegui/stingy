package models.dao

import models.domain.category.Category
import models.ebean.{Category => ECategory}
import utils.ScalaOptional.toScalaOption
import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object CategoryDAO {

  def toEbean(category: Category): ECategory = {
    new ECategory(
      if(category.id.isDefined) category.id.get else null,
      category.name
    )
  }

  def saveOrUpdate(category: Category): Option[Category] = {
    category.id match {
      case Some(_) =>
        val eCategory: ECategory = toEbean(category)
        eCategory.update()
        Some(Category(eCategory))
      case None =>
        val eCategory: ECategory = toEbean(category)
        eCategory.save()
        Some(Category(eCategory))
    }
  }

  def getById(id: Long) : Option[Category] = {
    toScalaOption(ECategory.getCategoryById(id)) match {
      case Some(category) =>
        Some(Category(category))
      case None =>
        None
    }
  }

  def getAllCategories: List[Category] = {
    ECategory.getAllCategories.map(Category.apply).toList
  }

  def delete(category: Category): Option[Boolean] = {
    category.id match {
      case Some(_) =>
        val eCategory: ECategory = toEbean(category)
        eCategory.delete()
        Some(true)
      case None =>
        None
    }
  }
}
