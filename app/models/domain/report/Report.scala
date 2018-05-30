package models.domain.report

import models.dao.ReportDAO
import models.domain.util.Date
import models.ebean.{Report => EReport}
import play.api.libs.json.{Json, OFormat}

case class Report(id: Option[Long], userId: Long, description: String, date: Date, solved: Boolean) {
  def equals(report: Report): Boolean = {
    if(report.id.isDefined && id.isDefined) id.get.equals(report.id.get)
    else false
  }
}

object Report extends ReportJsonFormat {

  def apply(report: EReport): Report = {
    Report(
      Option(report.getId),
      report.getUser.getId,
      report.getDescription,
      Date(report.getDate),
      report.getSolved
    )
  }

  def apply(reportCreate: ReportCreate): Report = {
    Report(
      None,
      reportCreate.userId,
      reportCreate.description,
      Date.now,
      false
    )
  }

  def saveOrUpdate(report: Report): Option[Report] = {
    ReportDAO.saveOrUpdate(report)
  }

  def getById(id : Long) : Option[Report] = {
    ReportDAO.getById(id)
  }

  def getByUserId(id : Long) : Option[Report] = {
    ReportDAO.getByUserId(id)
  }

  def getAll: List[Report] = {
    ReportDAO.getAllReports
  }

  def getUnresolved: List[Report] = {
    ReportDAO.getReportsUnresolved
  }

  def delete(report: Report): Option[Boolean] = {
    ReportDAO.delete(report)
  }

}

trait ReportJsonFormat{
  implicit val reportFormat: OFormat[Report] = Json.format[Report]
}
