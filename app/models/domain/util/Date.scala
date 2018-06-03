package models.domain.util

import org.joda.time.DateTime
import play.api.libs.json.{Json, OFormat}

case class Date(year: Int, month: Int, day: Int, hour: Int, minute: Int, second: Int){
  def toDateTime : DateTime = new DateTime(year,month,day,hour,minute,second)
  def isAfterNow : Boolean = toDateTime.isAfterNow
  def isBeforeNow : Boolean = toDateTime.isBeforeNow
  def toDateString : String = day + "-" + month + "-" + year
}

object Date extends DateJsonFormat{
  def now = Date(DateTime.now())
  def apply(dateTime: DateTime): Date = Date(dateTime.getYear, dateTime.getMonthOfYear, dateTime.getDayOfMonth, dateTime.getHourOfDay, dateTime.getMinuteOfHour, dateTime.getSecondOfMinute)

  def getMonthString(month: Int): String = {
    val months: List[String] = List("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
    months(month - 1)
  }

}

trait DateJsonFormat{
  implicit val dateFormat: OFormat[Date] = Json.format[Date]
}
