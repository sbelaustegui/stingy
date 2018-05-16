package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;

@Entity
public class ProductImage extends Model {

    @Id
    private Long id;
    @ManyToOne
    private Product product;
    @NotNull
    @ManyToOne
    private Image image;

    private static Finder<Long, ProductImage> finder = new Finder<>(ProductImage.class);

    public ProductImage(Long id, Product product, Image image) {
        this.id = id;
        this.product = product;
        this.image = image;
    }

    public static Optional<ProductImage> getById(Long id) {
        ProductImage productImage = finder.byId(id);
        if(productImage != null) {
            return Optional.of(productImage);
        } else {
            return Optional.empty();
        }
    }

    public static List<ProductImage> getProductImages(Long productId) {
        return Ebean.find(ProductImage.class).where().eq("product_id", productId).findList();
    }

    public static List<ProductImage> getByImageId(Long imageId) {
        return Ebean.find(ProductImage.class).where().eq("image_id", imageId).findList();
    }

    public static int getProductImageAmount(Long productId) {
        return Ebean.find(ProductImage.class).where().eq("product_id", productId).findList().size();
    }



    public Long getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public Image getImage() {
        return image;
    }

}
