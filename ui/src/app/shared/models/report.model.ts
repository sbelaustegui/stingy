import {DateModel} from "./date-model";

export class Report {

  static empty(): Report {
    return new Report(undefined, '', undefined, false)
  }

  public static from(jsonObject: any): Report {
    if (!jsonObject || !jsonObject.userId || !jsonObject.description
      || !jsonObject.date || !jsonObject.solved ) {
      throw new Error('Failed to instantiate Report from given jsonObject');
    }
    return new Report(jsonObject.userId, jsonObject.description, DateModel.from(jsonObject.date),jsonObject.solved, jsonObject.id);
  }

  constructor(public userId: number, public description: string, public date: DateModel,
              public solved: boolean, public id?: number) {
  }
}
