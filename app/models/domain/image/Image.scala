package models.domain.image

import models.dao.ImageDAO
import play.api.libs.json.{Json, OFormat}
import models.ebean.{Image => EImage}
import play.api.libs.Files.TemporaryFile
import play.api.mvc.MultipartFormData
case class Image(id: Option[Long], path: String)

object Image extends ImageJsonFormat {
  def apply(eImage: EImage): Image = {
    Image(
      Option(eImage.getId),
      eImage.getPath
    )
  }

  def apply(imageCreate: ImageCreate): Image = {
    Image(
      None,
      imageCreate.path
    )
  }

  def getById(id: Long): Option[Image] = {
    ImageDAO.getById(id)
  }

  def getAll: List[Image] = {
    ImageDAO.getAll
  }

  def saveOrUpdate(image: Image): Image = {
    ImageDAO.saveOrUpdate(image)
  }

  def delete(image: Image): Option[Boolean] = {
    ImageDAO.delete(image)
  }

  def saveImageFile(file: MultipartFormData.FilePart[TemporaryFile], email: String, imageId: Option[Long]): Option[Image] = {
    ImageDAO.saveImageFile(file, email, imageId)
  }
}

trait ImageJsonFormat {
  implicit val imageJsonFormat: OFormat[Image] = Json.format[Image]
}