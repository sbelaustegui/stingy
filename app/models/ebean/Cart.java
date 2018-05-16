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
public class Cart extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private User user;

    private static Finder<Long, Cart> finder = new Finder<>(Cart.class);

    public Cart(Long id, User user) {
        this.id = id;
        this.user = user;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<Cart> getCartById(Long id){
        Cart cart = finder.byId(id);
        if(cart != null){
            return Optional.of(cart);
        }
        return Optional.empty();
    }
    public static Optional<Cart> getCartByUserId(Long id){
        return Optional.ofNullable(Ebean.find(Cart.class).where().eq("user_id", id).findOne());
    }

    public static List<Cart> getAllCarts() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }
}
