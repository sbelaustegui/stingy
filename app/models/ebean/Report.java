package models.ebean;

import io.ebean.Ebean;
import io.ebean.Finder;
import io.ebean.Model;
import io.ebean.annotation.NotNull;
import org.joda.time.DateTime;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;
import java.util.Optional;

@Entity
public class Report extends Model {

    @Id
    @NotNull
    private Long id;
    @NotNull
    @ManyToOne
    private User user;
    private String description;
    private DateTime date;
    private Boolean solved;


    private static Finder<Long, Report> finder = new Finder<>(Report.class);

    public Report(Long id, User user, String description, DateTime date, Boolean solved) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.user = user;
        this.solved = solved;
    }

    @Override
    public void save(){
        super.save();
    }

    public static Optional<Report> getReportById(Long id){
        Report report = finder.byId(id);
        if(report != null){
            return Optional.of(report);
        }
        return Optional.empty();
    }

    public static Optional<Report> getReportByUserId(Long id){
        return Optional.ofNullable(Ebean.find(Report.class).where().eq("user_id", id).findOne());
    }

    public static List<Report> getReportsUnsolved(){
        return Ebean.find(Report.class).where().eq("solved", 0).findList();
    }

    public static List<Report> getAllReports() {
        return finder.all();
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public DateTime getDate() {
        return date;
    }

    public Boolean getSolved() {
        return solved;
    }

    public User getUser() {
        return user;
    }
}
