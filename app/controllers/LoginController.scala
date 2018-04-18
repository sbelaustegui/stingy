package controllers

import models.domain.authentication.{CaseUser, UserLogged, UserLogin}
import play.api.libs.json.Json
import pdi.jwt.JwtSession._
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import utils.ResponseGenerated
import javax.inject.Inject
import pdi.jwt.JwtSession
import models.domain.admin.Admin
import models.domain.user.User

import scala.util.{Failure, Success, Try}

/**
  * Created by Sebas Belaustegui on 10/04/2018.
  */
class LoginController @Inject()(cc: ControllerComponents) extends AbstractController(cc){

  def login = Action{
    request =>
      Try(request.body.asJson.get.as[UserLogin]) match {
        case Success(userLogin) =>
          User.authenticate(userLogin) match {
            case Some(user) =>
              request.jwtSession -- "user"
              val caseUser = CaseUser.toCaseUser(user)
              val session = JwtSession() + ("user", caseUser)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Login Successful", Json.toJson(caseUser))
                )
              ).withNewJwtSession.withJwtSession(session).withSession()
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "Invalid data")
                )
              )
          }
        case Failure(e) =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(BAD_REQUEST, "Missing data")
            )
          )
      }
  }

  def adminLogin = Action {
    request =>
      Try(request.body.asJson.get.as[UserLogin]) match {
        case Success(userLogin) =>
          Admin.authenticate(userLogin) match {
            case Some(admin) =>
              request.jwtSession -- "user"
              val caseUser = CaseUser.toCaseUser(admin)
              val session = JwtSession() + ("user", caseUser)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Login Successful", Json.toJson(caseUser))
                )
              ).withNewJwtSession.withJwtSession(session).withSession()
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "Invalid data")
                )
              )
          }
        case Failure(e) =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(BAD_REQUEST, "Missing data")
            )
          )
      }
  }

  def logout() = Action {
    request =>
      request.jwtSession -- "user"
      Ok(
        Json.toJson(
          ResponseGenerated(OK, "Logout Successful")
        )
      ).withNewSession
  }

  def loggedData() = Action(
    request =>
      request.jwtSession.getAs[CaseUser]("user") match {
        case Some(user) =>
          User.getById(user.id) match {
            case Some(userAux)=>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK,
                    "Logged",
                    Json.toJson(
                      UserLogged(
                        Some(
                          CaseUser.toCaseUser(userAux)
                        ),
                        isLogged = true
                      )
                    )
                  )
                )
              )
            case None=>
              InternalServerError(
                Json.toJson(
                  ResponseGenerated(
                    INTERNAL_SERVER_ERROR,
                    "Server Error",
                    Json.toJson(
                      UserLogged(
                        None,
                        isLogged = false
                      )
                    )
                  )
                )
              )
          }
        case _ =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST,
                "Not Logged",
                Json.toJson(
                  UserLogged(
                    None,
                    isLogged = false
                  )
                )
              )
            )
          )
      }
  )
}

