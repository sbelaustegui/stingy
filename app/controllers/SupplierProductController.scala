package controllers

import javax.inject.Inject
import models.domain.product.Product
import models.domain.supplierProduct.{SupplierProductCreate, _}
import models.domain.user.User
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class SupplierProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[SupplierProductCreate] match {
        case Some(supplierProductCreate) =>
          SupplierProduct.saveOrUpdate(SupplierProduct(supplierProductCreate)) match {
            case Some(savedSupplierProduct) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedSupplierProduct)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "SupplierProduct Name already in use"
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
    SupplierProduct.getById(id) match {
      case Some(supplierProduct) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "SupplierProduct found", Json.toJson(supplierProduct)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No supplierProduct for that id"
            )
          )
        )
    }
  }

  def getByLocation = Action {
    request =>
      request.body.asJson.get.asOpt[SupplierProductLocation] match {
        case Some(supplierProductLocation) =>
          User.getById(supplierProductLocation.userId) match {
            case Some(user) =>
              user.location match {
                case Some(location) =>
                  Product.getById(supplierProductLocation.productId) match {
                    case Some(_) =>
                      Ok(
                        Json.toJson(
                          ResponseGenerated(
                            OK, "SupplierProducts", Json.toJson(SupplierProduct.getByLocation(supplierProductLocation.productId, location))
                          )
                        )
                      )
                    case None =>
                      BadRequest(
                        Json.toJson(
                          ResponseGenerated(
                            BAD_REQUEST, "No product for that id"
                          )
                        )
                      )
                  }
                case None =>
                  BadRequest(
                    Json.toJson(
                      ResponseGenerated(
                        BAD_REQUEST, "No location for that user"
                      )
                    )
                  )
              }
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "No user for that id"
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid Data"
              )
            )
          )
      }
  }

  def getBySupplierId(id: Long) = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "SupplierProducts", Json.toJson(SupplierProduct.getBySupplierId(id))
        )
      )
    )
  }

  def getByProductId(id: Long) = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "SupplierProducts", Json.toJson(SupplierProduct.getByProductId(id))
        )
      )
    )
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All supplierProducts", Json.toJson(SupplierProduct.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    SupplierProduct.getById(id) match {
      case Some(supplierProduct) =>
        SupplierProduct.delete(supplierProduct) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "SupplierProduct deleted"
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
              BAD_REQUEST, "No supplierProduct for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[SupplierProductUpdate] match {
        case Some(update) =>
          SupplierProduct.getById(update.id) match {
            case Some(supplierProduct) =>
              val updatedSupplierProduct = update.toSupplierProduct(supplierProduct)
              SupplierProduct.saveOrUpdate(updatedSupplierProduct)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedSupplierProduct))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No supplierProduct found")
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