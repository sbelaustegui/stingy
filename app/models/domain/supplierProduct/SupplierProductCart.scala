package models.domain.supplierProduct

import models.domain.product.Product
import models.domain.supplier.Supplier
import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class SupplierProductCart(id: Option[Long], supplier: String, product: String, price: Double, date: Date)

object SupplierProductCart extends SupplierProductCartJsonFormat {
  def apply(supplierProduct: SupplierProduct): SupplierProductCart = {
    new SupplierProductCart(
      supplierProduct.id,
      Supplier.getById(supplierProduct.supplierId) match {
        case Some(supplier) =>
          supplier.name
        case None =>
          ""
      },
      Product.getById(supplierProduct.productId) match {
        case Some(product) =>
          product.name
        case None =>
          ""
      },
      supplierProduct.price,
      supplierProduct.date
    )
  }
}

trait SupplierProductCartJsonFormat{
  implicit val supplierProductCartFormat: OFormat[SupplierProductCart] = Json.format[SupplierProductCart]
}



