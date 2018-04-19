package models.ebean;

import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;

@Entity
public class Supplier extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private String name;
    private String location;
    private String description;

    private static Finder<Long, Supplier> finder = new Finder<>(Supplier.class);

    public Supplier(Long id, String name, String location, String description){
        this.id = id;
        this.name = name;
        this.location = location;
        this.description = description;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<Supplier> getSupplierById(Long id){
        Supplier supplier = finder.byId(id);
        if(supplier != null){
            return Optional.of(supplier);
        }
        return Optional.empty();
    }

    public static List<Supplier> getAllSuppliers() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }
}
