package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;

@Entity
public class CartProduct extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    @ManyToOne
    private Cart cart;
    @NotNull
    @ManyToOne
    private SupplierProduct supplierProduct;

    private static Finder<Long, CartProduct> finder = new Finder<>(CartProduct.class);

    public CartProduct(Long id, Cart cart, SupplierProduct supplierProduct) {
        this.id = id;
        this.cart = cart;
        this.supplierProduct = supplierProduct;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<CartProduct> getCartProductById(Long id){
        CartProduct product = finder.byId(id);
        if(product != null){
            return Optional.of(product);
        }
        return Optional.empty();
    }

    public static List<CartProduct> getCartProductsByCartId(Long id){
        return Ebean.find(CartProduct.class).where().eq("cart_id", id).findList();
    }

    public static List<CartProduct> getAllCartProducts() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public Cart getCart() {
        return cart;
    }

    public SupplierProduct getSupplierProduct() {
        return supplierProduct;
    }
}
