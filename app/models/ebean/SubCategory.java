package models.ebean;

import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class SubCategory extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private String name;

    private static Finder<Long, SubCategory> finder = new Finder<>(SubCategory.class);

    public SubCategory(Long id, String name){
        this.id = id;
        this.name = name;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<SubCategory> getSubCategoryById(Long id){
        SubCategory category = finder.byId(id);
        if(category != null){
            return Optional.of(category);
        }
        return Optional.empty();
    }

    public static List<SubCategory> getAllSubCategories() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
