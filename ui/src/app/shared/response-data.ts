export class ResponseData {

  constructor(private _status: number, private _msg: string, private _data: any) {}

  get status(): number { return this._status; }
  get msg(): string { return this._msg; }
  get data(): any { return this._data; }
}
