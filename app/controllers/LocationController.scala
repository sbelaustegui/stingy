package controllers

import models.dao.LocationDAO
import models.domain.location.{Location, LocationCreate, LocationUpdate, LocationUserCreate}
import models.domain.user.User
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated
import models.ebean.{Location => ELocation}

class LocationController extends Controller {

  def register = Action {
    request =>
      request.body.asJson.get.asOpt[LocationCreate] match {
        case Some(location) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Location saved", Json.toJson(Location.saveOrUpdate(Location(location)))
                  )
                )
              )
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
  def registerWithUser = Action {
    request =>
      request.body.asJson.get.asOpt[LocationUserCreate] match {
        case Some(location) =>
          User.getById(location.userId) match {
            case Some(user) =>
              val loc = Location.saveOrUpdate(Location(new LocationCreate(location.latitude, location.longitude)))
              val newUser = user.copy(location = loc)
              User.saveOrUpdate(newUser)
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Location saved", Json.toJson(loc)
                  )
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Invalid data"
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
      request.body.asJson.get.asOpt[LocationUpdate] match {
        case Some(locationUpdate) =>
          Location.getById(locationUpdate.id) match {
            case Some(location) =>
                Ok(
                  Json.toJson(
                    ResponseGenerated(
                      OK, "Location updated", Json.toJson(Location.saveOrUpdate(locationUpdate.toLocation(location)))
                    )
                  )
                )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "No location found for that id"
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
    Location.getById(id) match {
      case Some(location) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Location found", Json.toJson(location)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No location found"
            )
          )
        )
    }
  }

  def delete(id: Long) = Action {
    Location.getById(id) match {
      case Some(location) =>
        Location.delete(location) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Location deleted"
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
              BAD_REQUEST, "No location found for that id"
            )
          )
        )
    }
  }
}
