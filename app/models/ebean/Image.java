package models.ebean;

import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class Image extends Model {

    @Id
    private Long id;
    @NotNull
    private String path;

    private static Finder<Long, Image> finder = new Finder<>(Image.class);

    public Image(Long id, String path) {
        this.id = id;
        this.path = path;
    }

    public static Optional<Image> getById(Long id) {
        Image image = finder.byId(id);
        if(image != null) {
            return Optional.of(image);
        } else {
            return Optional.empty();
        }
    }

    public String getPath() {
        return path;
    }

    public Long getId() {
        return id;
    }

    public static List<Image> getAll() {
        return finder.all();
    }

    public void setPath(String value) {
        this.path = value;
    }
}
