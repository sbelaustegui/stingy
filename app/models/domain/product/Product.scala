package models.domain.product

import models.dao.{ImageDAO, ProductDAO}
import models.domain.image.Image
import models.domain.product.productImage.ProductImage
import models.domain.util.Date
import models.ebean.{Product => EProduct}
import play.api.libs.Files.TemporaryFile
import play.api.libs.json.{Json, OFormat}
import play.api.mvc.MultipartFormData

case class Product(id: Option[Long], name: String, imageUrl: String, description: String, price: Double, updateDate: Option[Date], uploadDate: Date, isValidated: Boolean, supplierId: Long, userId: Long, subcategoryId: Long) {
  def equals(product: Product): Boolean = {
    if(product.id.isDefined && id.isDefined) id.get.equals(product.id.get)
    else false
  }
}

object Product extends ProductJsonFormat {

  def apply(product: EProduct): Product = {
    Product(
      Option(product.getId),
      product.getName,
      product.getImageUrl,
      product.getDescription,
      product.getPrice,
      None,
      Date.now,
      product.isValidated,
      product.getSupplierId,
      product.getUserId,
      product.getSubcategoryId
    )
  }

  def apply(productCreate: ProductCreate): Product = {
    Product(
      None,
      productCreate.name,
      productCreate.imageUrl,
      productCreate.description,
      productCreate.price,
      None,
      Date.now,
      productCreate.isValidated,
      productCreate.supplierId,
      productCreate.userId,
      productCreate.subcategoryId
    )
  }

  def saveOrUpdate(product: Product): Option[Product] = {
    ProductDAO.saveOrUpdate(product)
  }

  def getById(id : Long) : Option[Product] = {
    ProductDAO.getById(id)
  }

  def getByName(name : String, subcategoryId: Long) : Option[List[Product]] = {
    ProductDAO.getByName(name, subcategoryId)
  }

  def getAll: List[Product] = {
    ProductDAO.getAllProducts
  }

  def validate(product: Product): Product = {
      ProductDAO.validate(product)
  }

  def delete(product: Product): Option[Boolean] = {
    ProductDAO.delete(product)
  }

  def addImage(productImage: ProductImage): ProductImage = {
    ProductDAO.addImage(productImage)
  }

}

trait ProductJsonFormat{
  implicit val productFormat: OFormat[Product] = Json.format[Product]
}
