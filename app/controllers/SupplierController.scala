package controllers

import javax.inject.Inject
import models.domain.supplier._
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class SupplierController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[SupplierCreate] match {
        case Some(supplierCreate) =>
          Supplier.saveOrUpdate(Supplier(supplierCreate)) match {
            case Some(savedSupplier) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedSupplier)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Supplier Name already in use"
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
    Supplier.getById(id) match {
      case Some(supplier) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Supplier found", Json.toJson(supplier)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No supplier for that id"
            )
          )
        )
    }
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All suppliers", Json.toJson(Supplier.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Supplier.getById(id) match {
      case Some(supplier) =>
        Supplier.delete(supplier) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Supplier deleted"
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
              BAD_REQUEST, "No supplier for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[SupplierUpdate] match {
        case Some(update) =>
          Supplier.getById(update.id) match {
            case Some(supplier) =>
              val updatedSupplier = update.toSupplier(supplier)
              Supplier.saveOrUpdate(updatedSupplier)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Supplier update successful", Json.toJson(updatedSupplier))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No supplier found")
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