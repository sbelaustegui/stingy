package models.dao

import models.domain.report.Report
import models.ebean.{User, Report => EReport}
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

object ReportDAO {

  def toEbean(report: Report): EReport = {
    new EReport(
      if(report.id.isDefined) report.id.get else null,
      User.getById(report.userId).get(),
      report.description,
      report.date.toDateTime,
      report.solved,
      report.rejected
    )
  }

  def saveOrUpdate(report: Report): Option[Report] = {
    report.id match {
      case Some(_) =>
        val eReport: EReport = toEbean(report)
        eReport.update()
        Some(Report(eReport))
      case None =>
        val eReport: EReport = toEbean(report)
        eReport.save()
        Some(Report(eReport))
    }
  }

  def getById(id: Long) : Option[Report] = {
    toScalaOption(EReport.getReportById(id)) match {
      case Some(report) =>
        Some(Report(report))
      case None =>
        None
    }
  }

  def getByUserId(id: Long) : List[Report] = {
    EReport.getReportByUserId(id).map(Report.apply).toList
  }

  def getReportsUnresolved : List[Report] = {
    EReport.getReportsUnsolved.map(Report.apply).toList
  }

  def getAllReports: List[Report] = {
    EReport.getAllReports.map(Report.apply).toList
  }

  def reject(id: Long): Boolean = {
    getById(id) match {
      case Some(report) =>
        val rejectedReport = report.copy(rejected = true)
        saveOrUpdate(rejectedReport).isDefined
      case None =>
        false
    }
  }

  def getNumberOfRejectedUserReports(id: Long): Integer = {
    EReport.getNumberOfRejectedUserReports(id)
  }

  def getNumberOfSolvedUserReports(id: Long): Integer = {
    EReport.getNumberOfSolvedUserReports(id)
  }

  def getNumberOfTotalUserReports(id: Long): Integer = {
    EReport.getNumberOfTotalUserReports(id)
  }

  def delete(report: Report): Option[Boolean] = {
    report.id match {
      case Some(_) =>
        val eReport: EReport = toEbean(report)
        eReport.delete()
        Some(true)
      case None =>
        None
    }
  }
}
