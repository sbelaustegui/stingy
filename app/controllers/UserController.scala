package controllers

import play.api.mvc.{Action, Controller}
import models.domain.user._
import play.api.libs.json.Json
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class UserController extends Controller {

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