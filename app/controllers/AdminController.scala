package controllers

import models.domain.admin.{Admin, AdminCreate, AdminUpdate}
import models.domain.user.User
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

class AdminController extends Controller {

  def register = Action {
    request =>
      request.body.asJson.get.asOpt[AdminCreate] match {
        case Some(admin) =>
          User.getByEmail(admin.email) match {
            case Some(_) =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Email already in use"
                  )
                )
              )
            case None =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Admin saved", Json.toJson(Admin.saveOrUpdate(admin.toAdmin))
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

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[AdminUpdate] match {
        case Some(adminUpdate) =>
          Admin.getById(adminUpdate.id) match {
            case Some(admin) =>
              adminUpdate.email match {
                case Some(email) =>
                  if(User.checkEmail(adminUpdate.id, email)) {
                    Ok(
                      Json.toJson(
                        ResponseGenerated(
                          OK, "admin updated", Json.toJson(Admin.saveOrUpdate(adminUpdate.toAdmin(admin)))
                        )
                      )
                    )
                  } else {
                    BadRequest(
                      Json.toJson(
                        ResponseGenerated(
                          BAD_REQUEST, "Email already in use"
                        )
                      )
                    )
                  }
                case None =>
                  Ok(
                    Json.toJson(
                      ResponseGenerated(
                        OK, "Admin updated", Json.toJson(Admin.saveOrUpdate(adminUpdate.toAdmin(admin)))
                      )
                    )
                  )
              }
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "No admin found for that id"
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
    Admin.getById(id) match {
      case Some(admin) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Admin found", Json.toJson(admin)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No admin found"
            )
          )
        )
    }
  }

  def getAll = Action {
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All admin", Json.toJson(Admin.getAll)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Admin.getById(id) match {
      case Some(admin) =>
        Admin.delete(admin) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Admin deleted"
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
              BAD_REQUEST, "No admin found for that id"
            )
          )
        )
    }
  }
}
