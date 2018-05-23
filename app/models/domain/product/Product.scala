package models.domain.product

import models.dao.ProductDAO
import models.domain.product.productImage.ProductImage
import models.domain.util.Date
import models.ebean.{Product => EProduct}
import play.api.libs.json.{Json, OFormat}

case class Product(id: Option[Long], name: String, imageUrl: String, description: String, uploadDate: Date, isValidated: Boolean, userId: Long, subcategoryId: Long) {
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
      Date.now,
      product.isValidated,
      product.getUserId,
      product.getSubcategoryId
    )
  }

  def apply(productCreate: ProductCreate): Product = {
    Product(
      None,
      productCreate.name,
      productCreate.imageUrl.get,
      productCreate.description,
      Date.now,
      productCreate.isValidated,
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
