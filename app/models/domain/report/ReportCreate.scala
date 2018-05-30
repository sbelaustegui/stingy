package models.domain.report

import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class ReportCreate(userId: Long, description: String)

object ReportCreate extends ReportCreateJsonFormat{
}

trait ReportCreateJsonFormat{
  implicit val reportFormat: OFormat[ReportCreate] = Json.format[ReportCreate]
}
