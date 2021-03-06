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
    private Boolean rejected;


    private static Finder<Long, Report> finder = new Finder<>(Report.class);

    public Report(Long id, User user, String description, DateTime date, Boolean solved, Boolean rejected) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.user = user;
        this.solved = solved;
        this.rejected = rejected;
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

    public static List<Report> getReportByUserId(Long id){
        return Ebean.find(Report.class).where().eq("user_id", id).findList();
    }

    public static List<Report> getReportsUnsolved(){
        return Ebean.find(Report.class).where().eq("solved", 0).eq("rejected", 0).findList();
    }

    public static Integer getNumberOfRejectedUserReports(Long id){
        return Ebean.find(Report.class).where().eq("user_id", id).eq("rejected", 1).findCount();
    }

    public static Integer getNumberOfSolvedUserReports(Long id){
        return Ebean.find(Report.class).where().eq("user_id", id).eq("solved", 1).findCount();
    }

    public static Integer getNumberOfTotalUserReports(Long id){
        return Ebean.find(Report.class).where().eq("user_id", id).findCount();
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

    public Boolean getRejected() {
        return rejected;
    }
}
