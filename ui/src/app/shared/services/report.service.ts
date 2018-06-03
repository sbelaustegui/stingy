import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Report} from "../models/report.model";

/*
# Report
POST        /api/report                                         controllers.ReportController.register()
GET         /api/report/all                                     controllers.ReportController.getAll
GET         /api/report/unresolved                              controllers.ReportController.getUnresolved
GET         /api/report/id/:id                                  controllers.ReportController.getById(id: Long)
GET         /api/report/resolve/:id                             controllers.ReportController.resolveReport(id: Long)
GET         /api/report/user/:id                                controllers.ReportController.getByUserId(id: Long)
PUT         /api/report                                         controllers.ReportController.update()
DELETE      /api/report/:id                                     controllers.ReportController.delete(id: Long)

*/

@Injectable()
export class ReportService {

  private _allReportsLoaded: boolean;
  private _reportsById: Map<number, Report>;

  constructor(private http: HttpService) {
    this._allReportsLoaded = false;
    this._reportsById = new Map();
  }

  get reports(): Promise<Report[]> {
    return this._allReportsLoaded ? Promise.resolve(this.allReportsToArray()) : this.requestReports();
  }


  public getReportById(id: number): Promise<Report> {
    return this._reportsById.get(id) ? Promise.resolve(this._reportsById.get(id)) : this.requestReport(id);
  }



  public getUnresolveReports(): Promise<Report[]> {
    return this.http.get('/api/report/unresolved')
      .then(res => {
        return res.data;
      })
  }

  public getReportByUserId(userId: number): Promise<Report[]> {
    return this.http.get('/api/report/user/'+ userId)
      .then(res => {
        return res.data;
      })

    // return this._reportsById.get(id) ? Promise.resolve(this._reportsById.get(id)) : this.requestReport(id);
  }

  public addReport(report: Report): Promise<Report> {
    return this.http
      .post('/api/report', report)
      .then(res => {
        this._reportsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateReport(report: Report): Promise<Report> {
    if (this._reportsById.get(report.id)) {
      return this.http
        .put('/api/report', report)
        .then(res => {
          this._reportsById.set(report.id, res.data);
          return res.data;
        });
    } else {
      this.requestReport(report.id).then(() => this.updateReport(report));
    }
  }

  public deleteReport(id: number): Promise<any> {
    return this.http.delete('/api/report/' + id)
      .then(res => {
        this._reportsById.delete(id);
        return res;
      });
  }

  private allReportsToArray(): Report[] {
    return Array.from(this._reportsById.values());
  }

  private requestReports(): Promise<Report[]> {
    return this.http
      .get('/api/report/all')
      .then(res => {
        const categories = res.data as Report[];
        categories.forEach(report => this._reportsById = this._reportsById.set(report.id, report));
        this._allReportsLoaded = true;
        return this.allReportsToArray();
      });
  }

  private requestReport(id: number): Promise<Report> {
    return this.http
      .get('/api/report/id/' + id)
      .then(res => {
        this._reportsById.set(id, res.data);
        return res.data;
      });
  }
}
