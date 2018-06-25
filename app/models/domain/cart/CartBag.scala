package models.domain.cart

import models.domain.supplier.Supplier
import models.domain.supplierProduct.SupplierProduct
import play.api.libs.json.{Json, OFormat}

case class CartBag(supplierName: String, products: List[CartBagProduct])

object CartBag extends CartBagJsonFormat {
  def apply(supplierProducts: List[SupplierProduct]): CartBag = {
    new CartBag(
      Supplier.getById(supplierProducts.head.supplierId) match {
        case Some(supplier) =>
          supplier.name
      },
      supplierProducts.map(CartBagProduct.apply)
    )
  }
}

trait CartBagJsonFormat{
  implicit val cartBagFormat: OFormat[CartBag] = Json.format[CartBag]
}



