export class ReportStatisticsModel {

  static empty(): ReportStatisticsModel {
    return new ReportStatisticsModel(undefined, undefined, undefined)
  }

  constructor(public total: number, public rejected: number, public solved: number) {
  }
}
