package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;

@Entity
public class Cart extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    @ManyToOne
    private User user;
    private Boolean current;
    private DateTime date;

    private static Finder<Long, Cart> finder = new Finder<>(Cart.class);

    public Cart(Long id, User user, Boolean current, DateTime date) {
        this.id = id;
        this.user = user;
        this.current = current;
        this.date = date;
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
        return Optional.ofNullable(Ebean.find(Cart.class).where().eq("user_id", id).and().eq("current", 1).findOne());
    }

    public static List<Cart> getCartsByUserId(Long id){
        return Ebean.find(Cart.class).where().eq("user_id", id).findList();
    }

    public static List<Cart> getAllCarts() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public Boolean getCurrent() {
        return current;
    }

    public DateTime getDate() {
        return date;
    }

    public User getUser() {
        return user;
    }
}
