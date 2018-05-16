package controllers

import java.nio.file.Paths

import javax.inject.Inject
import models.domain.image.Image
import models.domain.product._
import models.domain.product.productImage.ProductImageCreate
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

  def addImage = Action {
    request =>
      request.body.asMultipartFormData match {
        case Some(data) =>
          Json.parse(data.dataParts("productImage").head).asOpt[ProductImageCreate] match {
            case Some(productImage) =>
              Product.getById(productImage.productId) match {
                case Some(product) =>
                  data.file("image") match {
                    case Some(file) =>
                      Image.saveImageFile(file, product.name, None) match {
                        case Some(savedImage) =>
                          val imageProduct = Product.addImage(productImage.toProductImage(product, savedImage)).image
                          val newProduct = product.copy(imageUrl = imageProduct.path)
                          Product.saveOrUpdate(newProduct)
                          Ok(
                            Json.toJson(
                              ResponseGenerated(
                                OK, "Product image added", Json.toJson(imageProduct)
                              )
                            )
                          )
                        case None =>
                          BadRequest(
                            Json.toJson(
                              ResponseGenerated(
                                BAD_REQUEST, "Image save error"
                              )
                            )
                          )
                      }
                    case None =>
                      BadRequest(
                        Json.toJson(
                          ResponseGenerated(
                            BAD_REQUEST, "No image attached"
                          )
                        )
                      )
                  }
                case None =>
                  BadRequest(
                    Json.toJson(
                      ResponseGenerated(
                        BAD_REQUEST, "No product found for that id"
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
        case None =>
          BadRequest(
            Json.toJson(
              ResponseGenerated(
                BAD_REQUEST, "Invalid data type"
              )
            )
          )
      }
  }
}