package controllers

import javax.inject.Inject
import models.domain.product._
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class ProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[ProductCreate] match {
        case Some(productCreate) =>
          Product.saveOrUpdate(Product(productCreate)) match {
            case Some(savedProduct) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedProduct)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Product Name already in use"
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
    Product.getById(id) match {
      case Some(product) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Product found", Json.toJson(product)
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
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All products", Json.toJson(Product.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Product.getById(id) match {
      case Some(product) =>
        Product.delete(product) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Product deleted"
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
              BAD_REQUEST, "No product for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[ProductUpdate] match {
        case Some(update) =>
          Product.getById(update.id) match {
            case Some(product) =>
              val updatedProduct = update.toProduct(product)
              Product.saveOrUpdate(updatedProduct)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Product update successful", Json.toJson(updatedProduct))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No product found")
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