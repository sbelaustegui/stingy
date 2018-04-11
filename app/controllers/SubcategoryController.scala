package controllers

import javax.inject.Inject
import models.domain.subcategory._
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class SubcategoryController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[SubcategoryCreate] match {
        case Some(subcategoryCreate) =>
          Subcategory.saveOrUpdate(Subcategory(subcategoryCreate)) match {
            case Some(savedSubcategory) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedSubcategory)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Subcategory Name already in use"
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
    Subcategory.getById(id) match {
      case Some(subcategory) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Subcategory found", Json.toJson(subcategory)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No subcategory for that id"
            )
          )
        )
    }
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All categories", Json.toJson(Subcategory.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Subcategory.getById(id) match {
      case Some(subcategory) =>
        Subcategory.delete(subcategory) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Subcategory deleted"
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
              BAD_REQUEST, "No subcategory for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[SubcategoryUpdate] match {
        case Some(update) =>
          Subcategory.getById(update.id) match {
            case Some(subcategory) =>
              val updatedSubcategory = update.toSubcategory(subcategory)
              Subcategory.saveOrUpdate(updatedSubcategory)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedSubcategory))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No subcategory found")
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