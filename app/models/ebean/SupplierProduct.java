package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;
import org.joda.time.DateTime;


@Entity
public class SupplierProduct extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private Long supplierId;
    @NotNull
    private Long productId;
    private Double price;
    private DateTime date;

    private static Finder<Long, SupplierProduct> finder = new Finder<>(SupplierProduct.class);

    public SupplierProduct(Long id, Long supplierId, Long productId, Double price, DateTime date) {
        this.id = id;
        this.productId = productId;
        this.supplierId = supplierId;
        this.price = price;
        this.date = date;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<SupplierProduct> getSupplierProductById(Long id){
        SupplierProduct product = finder.byId(id);
        if(product != null){
            return Optional.of(product);
        }
        return Optional.empty();
    }

    public static List<SupplierProduct> getSupplierProductByProductId(Long id){
        return Ebean.find(SupplierProduct.class).where().eq("product_id", id).findList();
    }

    public static List<SupplierProduct> getSupplierProductBySupplierId(Long id){
        return Ebean.find(SupplierProduct.class).where().eq("supplier_id", id).findList();
    }

    public static List<SupplierProduct> getAllSupplierProducts() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public Long getProductId() {
        return productId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public Double getPrice() {
        return price;
    }

    public DateTime getDate() {
        return date;
    }
}
