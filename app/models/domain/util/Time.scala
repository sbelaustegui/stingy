package models.domain.util

import org.joda.time.DateTime
import play.api.libs.json.{Json, OFormat}

case class Time(hour: Int, minute: Int, second: Int){
  def toDateTime : DateTime = {
    val date = Date.now
    new DateTime(date.year, date.month, date.day, hour, minute, second)
  }

  def equals(time: Time): Boolean = {
    time.hour == hour && time.minute == minute && time.second == second
  }

  def addHour(hours: Int): Time = {
    if(hour + hours >= 24) {
      Time(hour + hours - 24, minute, second)
    }
    else Time(hour + hours, minute, second)
  }

  def addMinutes(minutes: Int): Time = {
    if(minute + minutes > 60) {
      var hours = 0
      var sum = minute + minutes
      while(sum > 60){
        sum = sum - 60
        hours += 1
      }
      if(hour + hours >= 24) {
        Time(hour + hours - 24, sum, second)
      }
      else Time(hour + hours, sum, second)
    }
    else {
      if(minutes + minute == 60) Time(hour + 1, 0, second)
      else Time(hour, minutes + minute, second)
    }
  }

  def removeMinutes(minutes: Int): Time = {
    if(minute - minutes < 0) {
      var hours = 0
      var difference = minute - minutes
      while(difference < 0){
        difference = difference + 60
        hours -= 1
      }
      if(hour + hours < 0) {
        Time(hour + hours + 24, difference, second)
      }
      else Time(hour + hours, difference, second)
    }
    else {
      if(minutes - minute == 0) Time(hour - 1, 0, second)
      else Time(hour, minutes - minute, second)
    }
  }

  def >(time: Time): Boolean = {
    if(hour > time.hour) true
    else {
      if(hour == time.hour && minute > time.minute) true
      else {
        if(hour == time.hour && minute == time.minute && second > time.second) true
        else false
      }
    }
  }

  def <(time: Time): Boolean = {
    if(hour < time.hour) true
    else {
      if(hour == time.hour && minute < time.minute) true
      else {
        if(hour == time.hour && minute == time.minute && second < time.second) true
        else false
      }
    }
  }

  //returns minute difference
  def -(time: Time): Int = {
    (hour - time.hour) * 60 + (minute - time.minute)
  }
}

object Time extends TimeJsonFormat{
  def empty = Time(0,0,0)
  def apply(time: DateTime): Time = Time(time.getHourOfDay, time.getMinuteOfHour, time.getSecondOfMinute)
  def apply(hour: Int, minute: Int): Time = Time(hour, minute, 0)
  def now: Time = Time(DateTime.now())
}

trait TimeJsonFormat{
  implicit val timeFormat: OFormat[Time] = Json.format[Time]
}
