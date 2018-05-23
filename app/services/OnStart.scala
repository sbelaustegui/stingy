package services

import javax.inject.{Inject, Singleton}
import play.api.inject.ApplicationLifecycle
import models.domain.admin.{Admin, AdminCreate}
import models.domain.category.{Category, CategoryCreate}
import models.domain.product.{Product, ProductCreate}
import models.domain.subcategory.{Subcategory, SubcategoryCreate}
import models.domain.supplier.location.{SupplierLocation, SupplierLocationCreate}
import models.domain.supplier.{Supplier, SupplierCreate}
import models.domain.user.{User, UserCreate}

import scala.concurrent.Future

trait OnStart {
  def save(): Unit
}

@Singleton
class OnStartImpl @Inject() (appLifecycle: ApplicationLifecycle) extends OnStart {

  def createUsers(): List[User] = {
    var users: List[User] = List()
    users = User.saveOrUpdate(User(UserCreate("Sebas", "Belaustegui", "sebas@gmail.com", "sebasb", "123456"))).get :: users
    users = User.saveOrUpdate(User(UserCreate("Lucas", "Manzanelli", "lucas@gmail.com", "lmanza", "123456"))).get :: users
    users
  }

  def createAdmins(): List[Admin] = {
    var users: List[Admin] = List()
    users = Admin.saveOrUpdate(Admin(AdminCreate("Admin", "Admin", "admin@gmail.com", "admin", "admin"))) :: users
    users
  }

  def createCategories(): List[Category] = {
    var categories: List[Category] = List()
    categories = Category.saveOrUpdate(Category(CategoryCreate("Comida"))).get :: categories
    categories = Category.saveOrUpdate(Category(CategoryCreate("Limpieza"))).get :: categories
    categories = Category.saveOrUpdate(Category(CategoryCreate("Tecnología"))).get :: categories
    categories
  }

  def createSubCategories(): List[Subcategory] = {
    var categories: List[Subcategory] = List()
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Harinas", 1))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Golosinas", 1))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Bebidas", 1))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Pisos", 2))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Cocina", 2))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Ropa", 2))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Celulares", 3))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Televisores", 3))).get :: categories
    categories = Subcategory.saveOrUpdate(Subcategory(SubcategoryCreate("Audio", 3))).get :: categories
    categories
  }

  def createSuppliersLocation(): List[SupplierLocation] = {
    var suppliers: List[SupplierLocation] = List()
    suppliers = SupplierLocation.saveOrUpdate(SupplierLocation(SupplierLocationCreate(43.5, 50.7))).get :: suppliers
    suppliers = SupplierLocation.saveOrUpdate(SupplierLocation(SupplierLocationCreate(43.5, 50.7))).get :: suppliers
    suppliers = SupplierLocation.saveOrUpdate(SupplierLocation(SupplierLocationCreate(43.5, 50.7))).get :: suppliers
    suppliers
  }

  def createSuppliers(): List[Supplier] = {
    var suppliers: List[Supplier] = List()
    suppliers = Supplier.saveOrUpdate(Supplier(SupplierCreate("Wallmart", "Hipermercado Wallmart de Pilar", 1))).get :: suppliers
    suppliers = Supplier.saveOrUpdate(Supplier(SupplierCreate("Carrefour", "Supermercado Carrefour de Pilar", 2))).get :: suppliers
    suppliers = Supplier.saveOrUpdate(Supplier(SupplierCreate("Vital", "Hipermercado Mayorista Vital de Pilar", 3))).get :: suppliers
    suppliers
  }

  def createProducts(): List[Product] = {
    var products: List[Product] = List()
    products = Product.saveOrUpdate(Product(ProductCreate("Harina Blancaflor", Option("http://www.molinos.com.ar/media/17852/Blancaflor-Leudante_producto.jpg"), "La marca pionera que creó la famosa harina leudante aportandole practicidad al amasado casero. Desde hace más de 55 años sigue siendo la compañía indispensable de varias generaciones de cocineras argentinas, que disfrutan cocinar. Blancaflor ofrece un resultado garantizado para quienes cocinan y amasan con un producto único.", isValidated = false, 1, 1, 1))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Harina Blancaflor", Option("http://www.molinos.com.ar/media/17852/Blancaflor-Leudante_producto.jpg"), "La marca pionera que creó la famosa harina leudante aportandole practicidad al amasado casero. Desde hace más de 55 años sigue siendo la compañía indispensable de varias generaciones de cocineras argentinas, que disfrutan cocinar. Blancaflor ofrece un resultado garantizado para quienes cocinan y amasan con un producto único.", isValidated = true, 2, 1, 1))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Harina Blancaflor", Option("http://www.molinos.com.ar/media/17852/Blancaflor-Leudante_producto.jpg"), "La marca pionera que creó la famosa harina leudante aportandole practicidad al amasado casero. Desde hace más de 55 años sigue siendo la compañía indispensable de varias generaciones de cocineras argentinas, que disfrutan cocinar. Blancaflor ofrece un resultado garantizado para quienes cocinan y amasan con un producto único.", isValidated = true, 3, 1, 1))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("ChupaPops", Option("https://res.cloudinary.com/dm8ly2rci/image/upload/c_fill,dpr_auto,f_auto,q_auto:eco,w_750/v1/chupachups.co.uk/2017-10/TBO-lollypops"), "\nChupachús de la marca Chupa Chups.\nUn chupachús, chupeta, chupete o chupetín es un caramelo duro y colorido de unos 2 a 3 cm de diámetro, de forma esférica u oval, con un palito insertado en el centro de la esfera que sirve para sostenerlo. Puede ser macizo o estar relleno de chicle, chocolate, etc.", isValidated = false, 2, 1, 2))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("ChupaPops", Option("https://res.cloudinary.com/dm8ly2rci/image/upload/c_fill,dpr_auto,f_auto,q_auto:eco,w_750/v1/chupachups.co.uk/2017-10/TBO-lollypops"), "\nChupachús de la marca Chupa Chups.\nUn chupachús, chupeta, chupete o chupetín es un caramelo duro y colorido de unos 2 a 3 cm de diámetro, de forma esférica u oval, con un palito insertado en el centro de la esfera que sirve para sostenerlo. Puede ser macizo o estar relleno de chicle, chocolate, etc.", isValidated = true, 1, 1, 2))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Coca Cola", Option("https://cdn.shopify.com/s/files/1/0706/6309/products/mayoreototal-caja-refresco-coca-cola-de-600-ml-con-24-botellas-coca-cola-refrescos-coca-cola-sku_large.jpg?v=1518347710"), "Caja de refresco Coca Cola en 24 botellas de 600 cada una de Coca-Cola.\nEs una deliciosa bebida refrescante y revitalizante, ayudara para quitar la sed además de su tradicional sabor.", isValidated = true, 3, 1, 3))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Coca Cola", Option("https://cdn.shopify.com/s/files/1/0706/6309/products/mayoreototal-caja-refresco-coca-cola-de-600-ml-con-24-botellas-coca-cola-refrescos-coca-cola-sku_large.jpg?v=1518347710"), "Caja de refresco Coca Cola en 24 botellas de 600 cada una de Coca-Cola.\nEs una deliciosa bebida refrescante y revitalizante, ayudara para quitar la sed además de su tradicional sabor.", isValidated = true, 1, 1, 3))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Poet Limpiapisos", Option("https://www.como-limpiar.com/wp-content/uploads/2010/07/poett1.jpg"), "Lo mejor para el cuidado de los  pisos de madera con una capa de D D es limpiarlos regularmente con un trapo humedecido con agua y jabón, o en tal caso con agua y algún desodorante líquido para piso que sea suave como el Poet.", isValidated = false, 2, 1, 4))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Poet Limpiapisos", Option("https://www.como-limpiar.com/wp-content/uploads/2010/07/poett1.jpg"), "Lo mejor para el cuidado de los  pisos de madera con una capa de D D es limpiarlos regularmente con un trapo humedecido con agua y jabón, o en tal caso con agua y algún desodorante líquido para piso que sea suave como el Poet.", isValidated = true, 3, 1, 4))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Mr Musculo Cocina", Option("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2-t2UrMRIc-6z07CQxMUMloe6Y99WMpdX87TltYet46pI9w_23Q"), "Limpia múltiples manchas de cocina. Es multisuperficies.", isValidated = true, 1, 1, 5))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Mr Musculo Cocina", Option("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2-t2UrMRIc-6z07CQxMUMloe6Y99WMpdX87TltYet46pI9w_23Q"), "Limpia múltiples manchas de cocina. Es multisuperficies.", isValidated = true, 3, 1, 5))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Disfraz Mr Musculo", Option("http://www.disfracesflorencia.com.ar/images/mrmusculo.jpg"), "Disfraz completo de Mr Musculo.", isValidated = true, 2, 1, 6))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Samsung S9", Option("https://cdn.shopify.com/s/files/1/0259/1735/products/samsung_galaxy_s9_phone_template_2048x.jpg?v=1525770901"), "Comparte la pantalla en las otras pantallas de Samsung, sin complicaciones.\nComparte fácilmente fotos y vídeos con la sincronización de tus dispositivos a través de tu cuenta Samsung. Así que puedes estar en casa aun si estás en otro lugar.", isValidated = true, 2, 1, 7))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Samsung S9", Option("https://cdn.shopify.com/s/files/1/0259/1735/products/samsung_galaxy_s9_phone_template_2048x.jpg?v=1525770901"), "Comparte la pantalla en las otras pantallas de Samsung, sin complicaciones.\nComparte fácilmente fotos y vídeos con la sincronización de tus dispositivos a través de tu cuenta Samsung. Así que puedes estar en casa aun si estás en otro lugar.", isValidated = true, 1, 1, 7))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Samsung LED 32", Option("https://www.ripley.com.pe/wcsstore/ripleype_CAT_AS/Attachment/WOP/2018168647492/2018168647492-1.jpg"), "Descubre una nueva manera de ver televisión con el TV 32J4300 de Samsung. Este innovador televisor inteligente de 32 pulgadas te brindará imágenes increíbles y podrás disfrutar de tus programas o películas favoritas en una gran pantalla. No esperes más para adquirir este televisor HD solo en Carrefour", isValidated = true, 2, 1, 8))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Equipo de Musica Noblex", Option("https://d2p3an6os91m4y.cloudfront.net/app/public/spree/products/232/gallery_large/7796962121206-1.jpg?1470945130"), "El equipo de audio Noblex Mnx121 es un completo sistema de sonido de alta definición que te brinda nada menos que 1500W de potencia mediante dos parlantes. Para tu comodidad incorpora un control remoto con amplias funciones, y un lector de tarjetas de memoria para que puedas compartir tus archivos de sonido de forma práctica y sencilla. ", isValidated = true, 3, 1, 9))).get :: products
    products = Product.saveOrUpdate(Product(ProductCreate("Equipo de Musica Noblex", Option("https://d2p3an6os91m4y.cloudfront.net/app/public/spree/products/232/gallery_large/7796962121206-1.jpg?1470945130"), "El equipo de audio Noblex Mnx121 es un completo sistema de sonido de alta definición que te brinda nada menos que 1500W de potencia mediante dos parlantes. Para tu comodidad incorpora un control remoto con amplias funciones, y un lector de tarjetas de memoria para que puedas compartir tus archivos de sonido de forma práctica y sencilla. ", isValidated = true, 2, 1, 9))).get :: products
    products
  }

  override def save(): Unit = {
    User.getByUsername("sebasb") match {
      case Some(_) =>
      case None =>
        createUsers()
        createAdmins()
        createCategories()
        createSubCategories()
        createSuppliersLocation()
        createSuppliers()
        createProducts()
    }
  }

  def start(): Unit = save()

  appLifecycle.addStopHook { () =>
    Future.successful(())
  }

  start()

}