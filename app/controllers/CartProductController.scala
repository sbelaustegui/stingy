package controllers

import javax.inject.Inject
import models.domain.cartProduct._
import models.domain.cartProduct.CartProductCreate
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class CartProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[CartProductCreate] match {
        case Some(cartProductCreate) =>
          CartProduct.saveOrUpdate(CartProduct(cartProductCreate)) match {
            case Some(savedCartProduct) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedCartProduct)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "CartProduct Name already in use"
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
    CartProduct.getById(id) match {
      case Some(cartProduct) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "CartProduct found", Json.toJson(cartProduct)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No cartProduct for that id"
            )
          )
        )
    }
  }

  def getByCartId(id: Long) = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "CartProducts", Json.toJson(CartProduct.getByCartId(id))
        )
      )
    )
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All cartProducts", Json.toJson(CartProduct.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    CartProduct.getById(id) match {
      case Some(cartProduct) =>
        CartProduct.delete(cartProduct) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "CartProduct deleted"
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
              BAD_REQUEST, "No cartProduct for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[CartProductUpdate] match {
        case Some(update) =>
          CartProduct.getById(update.id) match {
            case Some(cartProduct) =>
              val updatedCartProduct = update.toCartProduct(cartProduct)
              CartProduct.saveOrUpdate(updatedCartProduct)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedCartProduct))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No cartProduct found")
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