package models.domain.cart

import models.domain.product.Product
import models.domain.supplier.Supplier
import models.domain.supplierProduct.SupplierProduct
import models.domain.user.User
import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class CartBagProduct(supplierProductDate: Date, supplierProductPrice: Double, productDate: Date, productName: String, productDescription: String, userName: String)

object CartBagProduct extends CartBagProductJsonFormat {
  def apply(supplierProduct: SupplierProduct): CartBagProduct = {
    new CartBagProduct(
      supplierProduct.date,
      supplierProduct.price,
      Product.getById(supplierProduct.productId) match {
        case Some(product) =>
          product.uploadDate
      },
      Product.getById(supplierProduct.productId) match {
        case Some(product) =>
          product.name
      },
      Product.getById(supplierProduct.productId) match {
        case Some(product) =>
          product.description
      },
      Product.getById(supplierProduct.productId) match {
        case Some(product) =>
          User.getById(product.userId) match {
            case Some(user) =>
              user.name
          }
      }
    )
  }
}

trait CartBagProductJsonFormat{
  implicit val cartBagProductFormat: OFormat[CartBagProduct] = Json.format[CartBagProduct]
}



