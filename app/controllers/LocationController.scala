package controllers

import models.dao.LocationDAO
import models.domain.location.{Location, LocationCreate, LocationUpdate}
import play.api.libs.json.Json
import play.api.mvc.{Action, Controller}
import utils.ResponseGenerated

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
