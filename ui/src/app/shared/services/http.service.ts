import { Injectable }       from '@angular/core';
import { Headers, Http,
  Request, Response }     from '@angular/http';

import { Observable }       from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';

import { ResponseData }     from '../response-data';

@Injectable()
export class HttpService {

  private DEFAULT_HEADERS = {'Content-Type': 'application/json'};
  private _authToken: string;

  get authToken(): string { return this._authToken; }
  set authToken(value: string) { this._authToken = value; }

  get defaultHeaders(): Headers { return new Headers(this.DEFAULT_HEADERS); }
  get defaultOptions(): any { return { headers: this.defaultHeaders }; }

  get defaultHttp(): Http { return this._http; }

  constructor(private _http: Http) {}

  public request(url: string | Request): Promise<ResponseData> {
    return this.asPromise(this._http.request(url, this.requestOptions()));
  }

  public get(url: string): Promise<ResponseData> {
    return this.asPromise(this._http.get(url, this.requestOptions()));
  }

  public post(url: string, body: any): Promise<ResponseData> {
    return this.asPromise(this._http.post(url, body, this.requestOptions()));
  }

  public put(url: string, body: any): Promise<ResponseData> {
    return this.asPromise(this._http.put(url, body, this.requestOptions()));
  }

  public delete(url: string): Promise<ResponseData> {
    return this.asPromise(this._http.delete(url, this.requestOptions()));
  }

  public patch(url: string, body: any): Promise<ResponseData> {
    return this.asPromise(this._http.patch(url, body, this.requestOptions()));
  }

  public head(url: string): Promise<ResponseData> {
    return this.asPromise(this._http.head(url, this.requestOptions()));
  }

  public options(url: string): Promise<ResponseData> {
    return this.asPromise(this._http.options(url, this.requestOptions()));
  }

  private asPromise(observable: Observable<Response>): Promise<ResponseData> {
    return observable.toPromise().then(res => res.json() as ResponseData);
  }

  private requestOptions() {
    const authHeader = this._authToken ? { Authorization: this._authToken } : {};
    return {
      headers: new Headers(Object.assign(this.DEFAULT_HEADERS, authHeader)),
    };
  }

}
