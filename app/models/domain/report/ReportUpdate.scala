package models.domain.report

import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class ReportUpdate(id: Long, userId: Long, description: Option[String], date: Option[Date]) {
  def toReport(report: Report): Report = {
    Report(
      Option(id),
      report.userId,
      report.description,
      report.date,
      false
    )
  }
}

object ReportUpdate extends ReportUpdateJsonFormat

trait ReportUpdateJsonFormat{
  implicit val reportUpdateJsonFormat: OFormat[ReportUpdate] = Json.format[ReportUpdate]
}
