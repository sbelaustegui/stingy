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
    private String description;
    private String location;

    private static Finder<Long, Supplier> finder = new Finder<>(Supplier.class);

    public Supplier(Long id, String name, String description, String location){
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
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
