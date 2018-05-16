package controllers

import java.io.{File, FileWriter}
import java.nio.file.Paths

import javax.imageio.ImageIO
import javax.inject.Inject
import models.domain.product._
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, ControllerComponents}
import utils._

/**
  * stingy
  * Created by sebasbelaustegui on 27/03/18.
  */

class ProductController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def register = Action{
    request =>
      request.body.asJson.get.asOpt[ProductCreate] match {
        case Some(productCreate) =>
          Product.saveOrUpdate(Product(productCreate)) match {
            case Some(savedProduct) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(savedProduct)
                  )
                )
              )
            case None =>
             BadRequest(
                Json.toJson(
                  ResponseGenerated(
                    BAD_REQUEST, "Product Name already in use"
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def getById(id: Long) = Action {
    Product.getById(id) match {
      case Some(product) =>
        Ok(
          Json.toJson(
            ResponseGenerated(
              OK, "Product found", Json.toJson(product)
            )
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No product for that id"
            )
          )
        )
    }
  }

  def getAll = Action{
    Ok(
      Json.toJson(
        ResponseGenerated(
          OK, "All products", Json.toJson(Product.getAll)
        )
      )
    )
  }

  def search = Action{
    request =>
      request.body.asJson.get.asOpt[ProductSearch] match {
        case Some(product) =>
          Product.getByName(product.name, product.subcategoryId) match {
            case Some(productsFounded) =>
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "Ok",  Json.toJson(productsFounded)
                  )
                )
              )
            case None =>
              val emptyList : List[Product] = List.empty
              Ok(
                Json.toJson(
                  ResponseGenerated(
                    OK, "No results",  Json.toJson(emptyList)
                  )
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data"
              )
            )
          )
      }
  }

  def delete(id: Long) = Action {
    Product.getById(id) match {
      case Some(product) =>
        Product.delete(product) match {
          case Some(true) =>
            Ok(
              Json.toJson(
                ResponseGenerated(
                  OK, "Product deleted"
                )
              )
            )
          case _ =>
            BadRequest(
              Json.toJson(
                ResponseGenerated(
                  BAD_REQUEST, "Delete error"
                )
              )
            )
        }
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(
              BAD_REQUEST, "No product for that id"
            )
          )
        )
    }
  }

  def update = Action {
    request =>
      request.body.asJson.get.asOpt[ProductUpdate] match {
        case Some(update) =>
          Product.getById(update.id) match {
            case Some(product) =>
              val updatedProduct = update.toProduct(product)
              Product.saveOrUpdate(updatedProduct)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Product update successful", Json.toJson(updatedProduct))
                )
              )
            case None =>
              BadRequest(
                Json.toJson(
                  ResponseGenerated(BAD_REQUEST, "No product found")
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(BAD_REQUEST, "Invalid data")
            )
          )
      }
  }

  def validate(id: Long) = Action {
    Product.getById(id) match {
      case Some(product) =>
        Ok(
          Json.toJson(
            ResponseGenerated(OK, "Product update successful", Json.toJson(Product.validate(product)))
          )
        )
      case None =>
        BadRequest(
          Json.toJson(
            ResponseGenerated(BAD_REQUEST, "No product found")
          )
        )
    }
  }

  def saveImage = Action {
    request =>
      request.body.asMultipartFormData match {
        case Some(data) =>
          data.file("foto") match {
            case Some(file) =>
              val filename = Paths.get(file.filename).getFileName
              file.ref.moveTo(Paths.get(s"/tmp/picture/$filename"), replace = true)
              Ok(
                Json.toJson(
                  ResponseGenerated(OK, "Image Saved")
                )
              )
          }
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(BAD_REQUEST, "No se pudo guardar")
            )
          )
      }
  }

  def upload = Action(parse.multipartFormData) { request =>
    request.body.file("foto").map { picture =>
      val filename = Paths.get(picture.filename).getFileName
      picture.ref.moveTo(Paths.get(s"/tmp/images/$filename"), replace = true)
      Ok("File uploaded")
    }.getOrElse {
      BadRequest(
        Json.toJson(
          ResponseGenerated(BAD_REQUEST, "No se pudo guardar")
        )
      )
    }
  }
}