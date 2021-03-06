package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.List;
import java.util.Optional;
import org.joda.time.DateTime;

@Entity
public class Product extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    private String name;
    @NotNull
    private String imageUrl;
    @NotNull
    @Column(length = 900)
    private String description;
    private DateTime uploadDate;
    @NotNull
    private boolean isValidated;
    private Long userId;
    private Long subcategoryId;


    private static Finder<Long, Product> finder = new Finder<>(Product.class);

    public Product(Long id, String name, String imageUrl, String description, DateTime uploadDate, boolean isValidated, Long userId, Long subcategoryId) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
        this.uploadDate = uploadDate;
        this.isValidated = isValidated;
        this.userId = userId;
        this.subcategoryId = subcategoryId;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<Product> getProductById(Long id){
        Product product = finder.byId(id);
        if(product != null){
            return Optional.of(product);
        }
        return Optional.empty();
    }

    public static Optional<List<Product>> getProductBySubcategoryId(Long id){
        return Optional.of(Ebean.find(Product.class).where().eq("subcategory_id", id).findList());
    }

    public static Optional<List<Product>> getByName(String name, Long subcategoryId){
        return Optional.of(Ebean.find(Product.class).where().icontains("name", name).eq("subcategory_id", subcategoryId).eq("is_validated", 1).findList());
    }

    public static Integer getTotalProductAmountByUserId(Long id){
        return Ebean.find(Product.class).where().eq("user_id", id).findCount();
    }

    public static Integer getValidatedProductAmountByUserId(Long id){
        return Ebean.find(Product.class).where().eq("user_id", id).eq("is_validated", 1).findCount();
    }

    public static List<Product> getAllProducts() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public DateTime getUploadDate() {
        return uploadDate;
    }

    public boolean isValidated() {
        return isValidated;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getSubcategoryId() {
        return subcategoryId;
    }
}
