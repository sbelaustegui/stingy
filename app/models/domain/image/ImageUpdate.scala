package models.domain.image

import play.api.libs.json.{Json, OFormat}

case class ImageUpdate(id: Long, path: String, productId: Long) {
  def toImage(image: Image): Image = {
    Image(
      Some(id),
      path
    )
  }
}

object ImageUpdate extends ImageUpdateJsonFormat

trait ImageUpdateJsonFormat {
  implicit val imageUpdateJsonFormat: OFormat[ImageUpdate] = Json.format[ImageUpdate]
}