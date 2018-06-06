package controllers

import javax.inject.Inject
import models.domain.cart._
import models.domain.supplierProduct.SupplierProduct
import models.domain.user.User
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class CartController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[CartCreate] match {
        case Some(cartCreate) =>
          Cart.saveOrUpdate(Cart(cartCreate)) match {
            case Some(savedCart) =>
              Cart.getById(savedCart.userId) match {
                case Some(previousCart) =>
                  val cart = previousCart.copy(current = false)
                  Cart.saveOrUpdate(cart) match {
                    case Some(_) =>
                      Ok(
                        Json.toJson(
                          ResponseGenerated(
                            OK, "Ok",  Json.toJson(savedCart)
                          )
                        )
                      )
                    case None =>
                      BadRequest(
                        Json.toJson(
                          ResponseGenerated(
                            BAD_REQUEST, "Error saving cart"
                          )
                        )
                      )
                  }
                case None =>
                  Ok(
                    Json.toJson(
                      ResponseGenerated(
                        OK, "Ok",  Json.toJson(savedCart)
                      )
                    )
                  )
              }
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Error saving cart"
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
    Cart.getById(id) match {
      case Some(cart) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Cart found", Json.toJson(cart)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No cart for that id"
            )
          )
        )
    }
  }

  def getByUserId(id: Long) = Action {
    Cart.getByUserId(id) match {
      case Some(cart) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Cart found", Json.toJson(cart)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No cart for that user id"
            )
          )
        )
    }
  }

  def getCartsByUserId(id: Long) = Action {
    User.getById(id) match {
      case Some(_) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Carts founded", Json.toJson(Cart.getCartsByUserId(id))
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No user for that id"
            )
          )
        )
    }
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All carts", Json.toJson(Cart.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Cart.getById(id) match {
      case Some(cart) =>
        Cart.delete(cart) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Cart deleted"
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
              BAD_REQUEST, "No cart for that id"
            )
          )
        )
    }
  }

  def getCartBagsByCartId(cartId: Long) = Action {
    Cart.getById(cartId) match {
      case Some(_) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Cart Bag", Json.toJson(SupplierProduct.getSupplierProductsByCartId(cartId).groupBy(_.supplierId).toList.map(x => CartBag(x._2)))
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No cart for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[CartUpdate] match {
        case Some(update) =>
          Cart.getById(update.id) match {
            case Some(cart) =>
              val updatedCart = update.toCart(cart)
              Cart.saveOrUpdate(updatedCart)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedCart))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No cart found")
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