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
@DiscriminatorValue("Admin")
public class Admin extends AbstractUser{

    private static Finder<Long, Admin> finder = new Finder<>(Admin.class);

    public Admin(@NotNull Long id, @NotNull String name, @NotNull String lastName, @NotNull String email, @NotNull String username, @NotNull String password) {
        super(id, name, lastName, email, username, password);
    }

    public static Optional<Admin> getById(Long id){
        Admin admin = finder.byId(id);
        if(admin!= null){
            return Optional.of(admin);
        }
        return Optional.empty();
    }

    public static Optional<Admin> getByEmail(String email){
        return Optional.ofNullable(Ebean.find(Admin.class).where().eq("email", email).findOne());
    }

    public static Optional<Admin> getByUsername(String username){
        return Optional.ofNullable(Ebean.find(Admin.class).where().eq("username", username).findOne());
    }

    public static Optional<Admin> authenticate(String username, String clearPassword) {
        Optional<Admin> user = getByUsername(username);
        if (user.isPresent() && Encrypter.checkEncrypted(clearPassword, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    public static List<Admin> getAll() {
        return finder.all();
    }

}
