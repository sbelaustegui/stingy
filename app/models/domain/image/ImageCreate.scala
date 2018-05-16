package models.domain.image

import play.api.libs.json.{Json, OFormat}

case class ImageCreate(path: String)

object ImageCreate extends ImageCreateJsonFormat

trait ImageCreateJsonFormat {
  implicit val imageCreateJsonFormat: OFormat[ImageCreate] = Json.format[ImageCreate]
}