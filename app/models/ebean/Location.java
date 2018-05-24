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

    public static double distance(double lat1, double lon1, double lat2, double lon2, char unit) {
        double theta = lon1 - lon2;
        double dist = Math.sin(lat1 * (Math.PI / 180.0)) * Math.sin(lat2 * (Math.PI / 180.0)) + Math.cos(lat1 * (Math.PI / 180.0)) * Math.cos(lat2 * (Math.PI / 180.0)) * Math.cos(theta * (Math.PI / 180.0));
        dist = Math.acos(dist);
        dist = dist * (180.0 / Math.PI);
        dist = dist * 60 * 1.1515;
        if (unit == 'K') {
            dist = dist * 1.609344;
        } else if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return (dist);
    }
}
