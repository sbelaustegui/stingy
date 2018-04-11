package models.dao

import models.domain.subcategory.Subcategory
import utils.ScalaOptional.toScalaOption
import models.ebean.{SubCategory => ESubcategory}

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object SubcategoryDAO {

  def toEbean(category: Subcategory): ESubcategory = {
    new ESubcategory(
      if(category.id.isDefined) category.id.get else null,
      category.name
    )
  }

  def saveOrUpdate(category: Subcategory): Option[Subcategory] = {
    category.id match {
      case Some(_) =>
        val eSubcategory: ESubcategory = toEbean(category)
        eSubcategory.update()
        Some(Subcategory(eSubcategory))
      case None =>
        val eSubcategory: ESubcategory = toEbean(category)
        eSubcategory.save()
        Some(Subcategory(eSubcategory))
    }
  }

  def getById(id: Long) : Option[Subcategory] = {
    toScalaOption(ESubcategory.getSubCategoryById(id)) match {
      case Some(category) =>
        Some(Subcategory(category))
      case None =>
        None
    }
  }

  def getAllCategories: List[Subcategory] = {
    ESubcategory.getAllSubCategories.map(Subcategory.apply).toList
  }

  def delete(category: Subcategory): Option[Boolean] = {
    category.id match {
      case Some(_) =>
        val eSubcategory: ESubcategory = toEbean(category)
        eSubcategory.delete()
        Some(true)
      case None =>
        None
    }
  }
}
