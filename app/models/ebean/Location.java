package models.ebean;

import io.ebean.Finder;
import io.ebean.Model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Entity
public class Location extends Model {

    @Id
    @NotNull
    private Long id;
    private Double longitude;
    private Double latitude;

    private static Finder<Long, Location> finder = new Finder<>(Location.class);

    public Location(Long id, Double longitude, Double latitude) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    @Override
    public void save(){
        super.save();
    }

    public static List<Location> getAllsLocation() {
        return finder.all();
    }

    public static Optional<Location> getLocationById(Long id){
        Location location = finder.byId(id);
        if( location != null){
            return Optional.of(location);
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
