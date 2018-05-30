package controllers

import javax.inject.Inject
import models.domain.report._
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class ReportController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[ReportCreate] match {
        case Some(reportCreate) =>
          Report.saveOrUpdate(Report(reportCreate)) match {
            case Some(savedReport) =>
                Ok(
                  Json.toJson(
                    ResponseGenerated(
                      OK, "Ok",  Json.toJson(savedReport)
                    )
                  )
                )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Error saving report"
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
    Report.getById(id) match {
      case Some(report) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Report found", Json.toJson(report)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No report for that id"
            )
          )
        )
    }
  }

  def getByUserId(id: Long) = Action {
    Report.getByUserId(id) match {
      case Some(report) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Report found", Json.toJson(report)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No report for that user id"
            )
          )
        )
    }
  }

  def resolveReport(id: Long) = Action {
    Report.getByUserId(id) match {
      case Some(report) =>
        val resolvedReport = report.copy(solved = true)
        Report.saveOrUpdate(resolvedReport) match {
          case Some(_) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Report found", Json.toJson(report)
                )
              )
            )
          case None =>
            BadRequest(
              Json.toJson(
                ResponseGenerated(
                  BAD_REQUEST, "Error resolving report"
                )
              )
            )
        }
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No report for that user id"
            )
          )
        )
    }
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All reports", Json.toJson(Report.getAll)
        )
      )
    )
  }

  def getUnresolved = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All unresolved reports", Json.toJson(Report.getUnresolved)
        )
      )
    )
  }

  def delete(id: Long) = Action {
    Report.getById(id) match {
      case Some(report) =>
        Report.delete(report) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Report deleted"
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
              BAD_REQUEST, "No report for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[ReportUpdate] match {
        case Some(update) =>
          Report.getById(update.id) match {
            case Some(report) =>
              val updatedReport = update.toReport(report)
              Report.saveOrUpdate(updatedReport)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Update successful", Json.toJson(updatedReport))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No report found")
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