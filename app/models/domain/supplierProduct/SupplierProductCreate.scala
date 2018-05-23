package models.domain.supplierProduct

import models.domain.util.Date
import models.ebean.{SupplierProduct => ESupplierProduct}
import play.api.libs.json.{Json, OFormat}

case class SupplierProductCreate(supplierId: Long, productId: Long, price: Double)

object SupplierProductCreate extends SupplierProductCreateJsonFormat{
  def apply(supplierProduct: ESupplierProduct): SupplierProduct = {
    SupplierProduct(
      Option(supplierProduct.getId),
      supplierProduct.getSupplierId,
      supplierProduct.getProductId,
      supplierProduct.getPrice,
      Date.now
    )
  }
}

trait SupplierProductCreateJsonFormat{
  implicit val supplierProductFormat: OFormat[SupplierProductCreate] = Json.format[SupplierProductCreate]
}
