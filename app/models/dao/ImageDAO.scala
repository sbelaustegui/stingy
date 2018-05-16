package models.dao

import models.domain.image.Image
import models.ebean.{Image => EImage}
import play.api.libs.Files.TemporaryFile
import play.api.mvc.MultipartFormData
import utils.S3Client
import utils.ScalaOptional.toScalaOption

import scala.collection.JavaConversions._

object ImageDAO {

  def toEbean(image: Image): EImage = {
    new EImage(
      if(image.id.isDefined) image.id.get else null,
      image.path
    )
  }

  def getById(id: Long): Option[Image] = {
    toScalaOption[EImage](EImage.getById(id)).map(Image.apply)
  }

  def getAll: List[Image] = {
    EImage.getAll.map(Image.apply).toList
  }

  def saveOrUpdate(image: Image): Image = {
    image.id match {
      case Some(_) =>
        val eImage: EImage = toEbean(image)
        eImage.update()
        Image(eImage)
      case None =>
        val eImage: EImage = toEbean(image)
        eImage.save()
        Image(eImage)
    }
  }

  def delete(image: Image): Option[Boolean] = {
    image.id match {
      case Some(id) =>
        ProductImageDAO.deleteMultiple(ProductImageDAO.getByImageId(id)) match {
          case Some(true) =>
            val eImage: EImage = toEbean(image)
            eImage.setPath("")
            eImage.update()
            Some(true)
          case _ => None
        }
      case None => None
    }
  }

  def saveImageFile(file: MultipartFormData.FilePart[TemporaryFile], name: String, imageId: Option[Long]): Option[Image] = {
    S3Client.uploadFile(file.ref.file.getPath, name + "/" + file.filename) match {
      case Some(filePath) =>
        Some(saveOrUpdate(Image(imageId, filePath)))
      case None =>
        None
    }
  }

  def deleteImageFile(name: String, fileName: String): Option[Boolean] = {
    S3Client.deleteFile(name + "/" + fileName)
  }
}
