package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;
import utils.Encrypter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class User extends Model {

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

    private static Finder<Long, User> finder = new Finder<>(User.class);

    public User(Long id, String name, String lastName, String email,
                String username, String password) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    @Override
    public void save(){
        password = Encrypter.encrypt(password);
        super.save();
    }

    public static Optional<User> getUserById(Long id){
        User user = finder.byId(id);
        if(user != null){
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public static List<User> getAllUsers() {
        return finder.all();
    }

    public static Optional<User> getUserByUserName(String username){
        User user = Ebean.find(User.class).where().eq("username", username).findOne();
        if(user != null) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public static Optional<User> getUserByEmail(String email){
        User user = Ebean.find(User.class).where().eq("email", email).findOne();
        if(user != null) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }
}
