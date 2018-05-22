package models.ebean;

import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Entity
public class SupplierLocation extends Model {

    @Id
    @NotNull
    private Long id;
    private Double longitude;
    private Double latitude;

    private static Finder<Long, SupplierLocation> finder = new Finder<>(SupplierLocation.class);

    public SupplierLocation(Long id, Double longitude, Double latitude) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    @Override
    public void save(){
        super.save();
    }

    public static List<SupplierLocation> getAllSuppliersLocation() {
        return finder.all();
    }

    public static Optional<SupplierLocation> getSupplierLocationById(Long id){
        SupplierLocation supplier = finder.byId(id);
        if(supplier != null){
            return Optional.of(supplier);
        }
        return Optional.empty();
    }

    public Double getLongitude() {
        return longitude;
    }

    public Long getId() {
        return id;
    }

    public Double getLatitude() {
        return latitude;
    }
}
