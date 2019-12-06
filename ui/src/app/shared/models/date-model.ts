export class DateModel{

  public static from(jsonObject: any): DateModel {
    if (!jsonObject || !jsonObject.year || !jsonObject.month || !jsonObject.day) {
      throw new Error('Failed to instantiate Date from given jsonObject');
    }
    return new DateModel(jsonObject.year, jsonObject.month, jsonObject.day);
  }

  static empty():DateModel{
    return new DateModel(undefined, undefined, undefined);
  }

  static dateModelFromDate(date: Date): DateModel{
    return new DateModel(date.getFullYear(), date.getMonth()+1, date.getDate());
  }

  static dateModelFromDateWithTime(date: Date): DateModel{
    return new DateModel(date.getFullYear(), date.getMonth()+1, date.getDate(), 0, 0, 0);
  }

  toStringDate(): string{
    return this.day.toString()+'/'+this.month.toString()+'/'+this.year.toString();
  }

  toDateString(): string{
    return (this.year?this.year.toString():'')+(this.month?'-'+(this.month.toString().length==1?'0'+this.month.toString():this.month.toString())+'-':'')+(this.day?(this.day.toString().length==1?'0'+this.day.toString():this.day.toString()):'');
  }

  toStringDateValue(): string{
    return this.year.toString()+'-'+this.month.toString()+'-0'+this.day.toString();
  }

  public getFullYear(): number {
    return this.year;
  }

  public getMonth(): number {
    return this.month-1;
  }

  public getDate(): number {
    return this.day;
  }

  toStringDay(): string{
    return this.day.toString();
  }

  toStringMonth(): string{
    return this.month.toString();
  }

  toStringYear(): string{
    return this.year.toString();
  }

  constructor(public year: number, public month: number, public day: number, public minute?: number, public hour?: number, public second?: number){}
}
