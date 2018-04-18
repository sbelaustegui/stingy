package models.ebean;

import io.ebean.Ebean;
import io.ebean.Model;
import javax.validation.constraints.NotNull;
import io.ebean.Finder;
import utils.Encrypter;

import javax.persistence.*;
import java.util.Optional;

/**
 * Created by Sebas Belaustegui on 18/04/2018.
 */

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
public abstract class AbstractUser extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private String name;
    @NotNull
    private String lastName;
    @NotNull
    @Column(unique = true)
    private String email;
    @NotNull
    @Column(unique = true)
    private String username;
    @NotNull
    private String password;

    private static Finder<Long, AbstractUser> finder = new Finder<>(AbstractUser.class);

    public AbstractUser(@NotNull Long id, @NotNull String name, @NotNull String lastName, @NotNull String email, @NotNull String username, @NotNull String password){
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public static Optional<AbstractUser> getUserById(Long id){
        AbstractUser user = finder.byId(id);
        if(user!= null){
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public static Optional<AbstractUser> getUserByEmail(String email) {
        return Optional.ofNullable(Ebean.find(AbstractUser.class).where().eq("email", email).findOne());
    }

    public static Optional<AbstractUser> getUserByUsername(String username) {
        return Optional.ofNullable(Ebean.find(AbstractUser.class).where().eq("username", username).findOne());
    }

    public static Optional<AbstractUser> authenticateUser(String username, String clearPassword) {
        Optional<AbstractUser> user = getUserByUsername(username);
        if (user.isPresent() && Encrypter.checkEncrypted(clearPassword, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }

    @NotNull
    public Long getId() {
        return id;
    }

    @NotNull
    public String getPassword() {
        return password;
    }

    @NotNull
    public String getEmail() {
        return email;
    }

    @NotNull
    public String getName() {
        return name;
    }

    @NotNull
    public String getLastName() {
        return lastName;
    }

    @NotNull
    public String getUsername() {
        return username;
    }
}
