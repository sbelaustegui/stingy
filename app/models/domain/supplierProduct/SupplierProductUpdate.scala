package models.domain.supplierProduct

import models.domain.util.Date
import play.api.libs.json.{Json, OFormat}

case class SupplierProductUpdate(id: Long, supplierId: Option[Long], productId: Option[Long], price: Option[Double], date: Option[Date]) {
  def toSupplierProduct(supplierProduct: SupplierProduct): SupplierProduct = {
    SupplierProduct(
      Option(id),
      supplierProduct.supplierId,
      supplierProduct.productId,
      supplierProduct.price,
      supplierProduct.date
    )
  }
}

object SupplierProductUpdate extends SupplierProductUpdateJsonFormat

trait SupplierProductUpdateJsonFormat{
  implicit val supplierProductUpdateJsonFormat: OFormat[SupplierProductUpdate] = Json.format[SupplierProductUpdate]
}
