package controllers

import javax.inject.Inject
import models.domain.cart.Cart
import play.api.mvc.{AbstractController, ControllerComponents}
import models.domain.user._
import play.api.libs.json.Json
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class UserController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[UserCreate] match {
        case Some(userCreate) =>
          User.saveOrUpdate(User(userCreate)) match {
            case Some(savedUser) =>
              var cart: Cart = new Cart(None, savedUser.id.get)
              Cart.saveOrUpdate(cart) match {
                case Some(_) =>
                  Ok(
                    Json.toJson(
                      ResponseGenerated(
                        OK, "Ok",  Json.toJson(savedUser)
                      )
                    )
                  )
                case None =>
                  BadRequest(
                    Json.toJson(
                      ResponseGenerated(
                        BAD_REQUEST, "Error when creating User Cart"
                      )
                    )
                  )
              }
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Username already in use"
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
    User.getById(id) match {
      case Some(user) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "User found", Json.toJson(user)
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
          OK, "All users", Json.toJson(User.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    User.getById(id) match {
      case Some(user) =>
        User.delete(user) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "User deleted"
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
              BAD_REQUEST, "No user for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[UserUpdate] match {
        case Some(update) =>
          User.getById(update.id) match {
            case Some(user) =>
              update.username match {
                case Some(username) =>
                  if(username != user.username) {
                    User.getByUsername(username) match {
                      case Some(foundUser) =>
                        if(user.equals(foundUser)){
                          update.email match {
                            case Some(email) =>
                              User.getByEmail(email) match {
                                case Some(mailUser) =>
                                  if(user.equals(mailUser)){
                                    val updatedUser = update.toUser(user)
                                    User.saveOrUpdate(updatedUser)
                                    Ok(
                                      Json.toJson(
                                        ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                                      )
                                    )
                                  }
                                  else {
                                    BadRequest(
                                      Json.toJson(
                                        ResponseGenerated(BAD_REQUEST, "Mail already in use")
                                      )
                                    )
                                  }
                                case None =>
                                  val updatedUser = update.toUser(user)
                                  User.saveOrUpdate(updatedUser)
                                  Ok(
                                    Json.toJson(
                                      ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                                    )
                                  )
                              }
                            case None =>
                              val updatedUser = update.toUser(user)
                              User.saveOrUpdate(updatedUser)
                              Ok(
                                Json.toJson(
                                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                                )
                              )
                          }
                        }
                        else {
                          BadRequest(
                            Json.toJson(
                              ResponseGenerated(BAD_REQUEST, "Username already in use")
                            )
                          )
                        }
                      case None =>
                        User.getByEmail(user.email) match {
                          case Some(mailUser) =>
                            if(user.equals(mailUser)){
                              val updatedUser = update.toUser(user)
                              User.saveOrUpdate(updatedUser)
                              Ok(
                                Json.toJson(
                                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                                )
                              )
                            }
                            else {
                              BadRequest(
                                Json.toJson(
                                  ResponseGenerated(BAD_REQUEST, "Mail already in use")
                                )
                              )
                            }
                          case None =>
                            val updatedUser = update.toUser(user)
                            User.saveOrUpdate(updatedUser)
                            Ok(
                              Json.toJson(
                                ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                              )
                            )
                        }
                    }
                  }
                  else if(username == user.username && !user.equals(user)) {
                    BadRequest(
                      Json.toJson(
                        ResponseGenerated(BAD_REQUEST, "Username already in use")
                      )
                    )
                  }
                  else {
                    User.getByEmail(user.email) match {
                      case Some(mailUser) =>
                        if(mailUser.equals(user)){
                          val updatedUser = update.toUser(user)
                          User.saveOrUpdate(updatedUser)
                          Ok(
                            Json.toJson(
                              ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                            )
                          )
                        }
                        else {
                          BadRequest(
                            Json.toJson(
                              ResponseGenerated(BAD_REQUEST, "Mail already in use")
                            )
                          )
                        }
                      case None =>
                        val updatedUser = update.toUser(user)
                        User.saveOrUpdate(updatedUser)
                        Ok(
                          Json.toJson(
                            ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                          )
                        )
                    }
                  }
                case None =>
                  User.getByEmail(user.email) match {
                    case Some(mailUser) =>
                      if(mailUser.equals(user)){
                        val updatedUser = update.toUser(user)
                        User.saveOrUpdate(updatedUser)
                        Ok(
                          Json.toJson(
                            ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                          )
                        )
                      }
                      else {
                        BadRequest(
                          Json.toJson(
                            ResponseGenerated(BAD_REQUEST, "Mail already in use")
                          )
                        )
                      }
                    case None =>
                      val updatedUser = update.toUser(user)
                      User.saveOrUpdate(updatedUser)
                      Ok(
                        Json.toJson(
                          ResponseGenerated(OK, "Update successful", Json.toJson(updatedUser))
                        )
                      )
                  }
              }
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No user found")
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