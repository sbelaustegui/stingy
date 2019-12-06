package models.domain.supplierProduct

import models.dao.{ProductDAO, SupplierProductDAO}
import models.domain.location.Location
import models.domain.product.Product
import models.domain.statistics.ProductPriceWithDate
import models.domain.util.Date
import models.ebean.{SupplierProduct => ESupplierProduct}
import play.api.libs.json.{Json, OFormat}

case class SupplierProduct(id: Option[Long], supplierId: Long, productId: Long, price: Double, date: Date, userId: Long) {
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
      Date(supplierProduct.getDate),
      supplierProduct.getUserId
    )
  }

  def apply(supplierProductCreate: SupplierProductCreate): SupplierProduct = {
    SupplierProduct(
      None,
      supplierProductCreate.supplierId,
      supplierProductCreate.productId,
      supplierProductCreate.price,
      Date.now,
      supplierProductCreate.userId
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

  def getSupplierProductsByCartId(id : Long) : List[SupplierProduct] = {
    SupplierProductDAO.getByCartId(id)
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

  def getPrices(productId: Long, from: Date, to: Date): List[ProductPriceWithDate] = {
    SupplierProductDAO.getPrices(productId, from, to)
  }

}

trait SupplierProductJsonFormat{
  implicit val supplierProductFormat: OFormat[SupplierProduct] = Json.format[SupplierProduct]
}
