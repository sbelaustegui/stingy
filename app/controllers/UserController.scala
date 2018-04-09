package controllers

import javax.inject.Inject
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
}