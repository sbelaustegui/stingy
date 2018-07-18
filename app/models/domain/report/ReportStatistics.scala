package models.domain.report

import play.api.libs.json.{Json, OFormat}

case class ReportStatistics(total: Long, rejected: Long, solved: Long)

object ReportStatistics extends ReportStatisticsJsonFormat{
}

trait ReportStatisticsJsonFormat{
  implicit val reportStatisticsFormat: OFormat[ReportStatistics] = Json.format[ReportStatistics]
}
