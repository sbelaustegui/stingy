package models.ebean;

import io.ebean.Ebean;
import utils.Encrypter;
import io.ebean.Finder;

import javax.validation.constraints.NotNull;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.List;
import java.util.Optional;

@Entity
@DiscriminatorValue("User")
public class User extends AbstractUser{

    private String userId;

    private static Finder<Long, User> finder = new Finder<>(User.class);

    public User(@NotNull Long id, @NotNull String name, @NotNull String lastName, @NotNull String email, @NotNull String username, @NotNull String password, String userId) {
        super(id, name, lastName, email, username, password);
        this.userId = userId;
    }

    public static Optional<User> getById(Long id){
        User admin = finder.byId(id);
        if(admin!= null){
            return Optional.of(admin);
        }
        return Optional.empty();
    }

    public static Optional<User> getByEmail(String email){
        return Optional.ofNullable(Ebean.find(User.class).where().eq("email", email).findOne());
    }

    public static Optional<User> getByUsername(String username){
        return Optional.ofNullable(Ebean.find(User.class).where().eq("username", username).findOne());
    }

    public static Optional<User> getByUserId(Long userId){
        return Optional.ofNullable(Ebean.find(User.class).where().eq("userId", userId).findOne());
    }

    public static Optional<User> authenticate(String email, String clearPassword) {
        Optional<User> user = getByEmail(email);
        if (user.isPresent() &&  (user.get().getPassword() != null) && Encrypter.checkEncrypted(clearPassword, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    public String getUserId() {
        return userId;
    }

    public static List<User> getAll() {
        return finder.all();
    }
}