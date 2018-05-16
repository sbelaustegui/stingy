package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class CartProduct extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private Cart cart;
    @NotNull
    private Product product;

    private static Finder<Long, CartProduct> finder = new Finder<>(CartProduct.class);

    public CartProduct(Long id, Cart cart, Product product) {
        this.id = id;
        this.cart = cart;
        this.product = product;
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

    public static List<CartProduct> getAllCartProducts() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public Cart getCart() {
        return cart;
    }

    public Product getProduct() {
        return product;
    }
}
