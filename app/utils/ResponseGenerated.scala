package utils

import play.api.libs.json.{JsValue, Json, OFormat}

case class ResponseGenerated(status: Int, msg: String, data: JsValue)

object ResponseGenerated extends ResponseJsonFormat{
  def apply(status: Int, msg: Option[String], data: Option[JsValue]): ResponseGenerated = ResponseGenerated(status,msg.getOrElse(""),data.getOrElse(Json.obj()))
  def apply(status: Int, msg: String): ResponseGenerated = ResponseGenerated(status,msg,Json.obj())
  def apply(status: Int, data: JsValue): ResponseGenerated = ResponseGenerated(status,"",data)
}

trait ResponseJsonFormat{
  implicit val responseGeneratedFormat: OFormat[ResponseGenerated] = Json.format[ResponseGenerated]
}
