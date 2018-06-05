package models.domain.supplierProduct

import models.dao.SupplierProductDAO
import models.domain.location.Location
import models.domain.util.Date
import models.ebean.{SupplierProduct => ESupplierProduct}
import play.api.libs.json.{Json, OFormat}

case class SupplierProduct(id: Option[Long], supplierId: Long, productId: Long, price: Double, date: Date) {
  def equals(supplierProduct: SupplierProduct): Boolean = {
    if(supplierProduct.id.isDefined && id.isDefined) id.get.equals(supplierProduct.id.get)
    else false
  }
}

object SupplierProduct extends SupplierProductJsonFormat {

  def apply(supplierProduct: ESupplierProduct): SupplierProduct = {
    SupplierProduct(
      Option(supplierProduct.getId),
      supplierProduct.getSupplierId,
      supplierProduct.getProductId,
      supplierProduct.getPrice,
      Date(supplierProduct.getDate)
    )
  }

  def apply(supplierProductCreate: SupplierProductCreate): SupplierProduct = {
    SupplierProduct(
      None,
      supplierProductCreate.supplierId,
      supplierProductCreate.productId,
      supplierProductCreate.price,
      Date.now
    )
  }

  def saveOrUpdate(supplierProduct: SupplierProduct): Option[SupplierProduct] = {
    SupplierProductDAO.saveOrUpdate(supplierProduct)
  }

  def getById(id : Long) : Option[SupplierProduct] = {
    SupplierProductDAO.getById(id)
  }

  def getBySupplierId(id : Long) : List[SupplierProduct] = {
    SupplierProductDAO.getBySupplierId(id)
  }

  def getByProductId(id : Long) : List[SupplierProduct] = {
    SupplierProductDAO.getByProductId(id)
  }

  def getByUserId(id : Long) : List[SupplierProduct] = {
    SupplierProductDAO.getByUserId(id)
  }

  def getByCartId(id : Long) : List[SupplierProductCart] = {
    SupplierProductDAO.getByCartId(id).map(SupplierProductCart.apply)
  }

  def getByLocation(productId: Long, userLocation: Location) : List[SupplierProduct] = {
    SupplierProductDAO.getByLocation(productId, userLocation)
  }

  def getAll: List[SupplierProduct] = {
    SupplierProductDAO.getAllSupplierProducts
  }

  def delete(supplierProduct: SupplierProduct): Option[Boolean] = {
    SupplierProductDAO.delete(supplierProduct)
  }

}

trait SupplierProductJsonFormat{
  implicit val supplierProductFormat: OFormat[SupplierProduct] = Json.format[SupplierProduct]
}
