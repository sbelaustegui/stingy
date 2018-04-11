package controllers

import javax.inject.Inject
import models.domain.category._
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class CategoryController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[CategoryCreate] match {
        case Some(categoryCreate) =>
          Category.saveOrUpdate(Category(categoryCreate)) match {
            case Some(savedCategory) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedCategory)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Category Name already in use"
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def getById(id: Long) = Action {
    Category.getById(id) match {
      case Some(category) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Category found", Json.toJson(category)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No category for that id"
            )
          )
        )
    }
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All categories", Json.toJson(Category.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Category.getById(id) match {
      case Some(category) =>
        Category.delete(category) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Category deleted"
                )
              )
            )
          case _ =>
            BadRequest(
              Json.toJson(
                ResponseGenerated(
                  BAD_REQUEST, "Delete error"
                )
              )
            )
        }
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No category for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[CategoryUpdate] match {
        case Some(update) =>
          Category.getById(update.id) match {
            case Some(category) =>
              val updatedCategory = update.toCategory(category)
              Category.saveOrUpdate(updatedCategory)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedCategory))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No category found")
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(BAD_REQUEST, "Invalid data")
            )
          )
      }
  }
}