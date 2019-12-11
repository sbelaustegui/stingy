import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {User} from "../models/user.model";

/*
User routes
  POST        /api/user                                           controllers.UserController.register()
  GET         /api/user/all                                       controllers.UserController.getAll
  GET         /api/user/id/:id                                    controllers.UserController.getById(id: Long)
  PUT         /api/user                                           controllers.UserController.update()
  DELETE      /api/user/:id                                       controllers.UserController.delete(id: Long)
*/

@Injectable()
export class UserService {

  private _allUsersLoaded: boolean;
  private _usersById: Map<number, User>;

  constructor(private http: HttpService) {
    this._allUsersLoaded = false;
    this._usersById = new Map();
  }

  get users(): Promise<User[]> {
    return this._allUsersLoaded ? Promise.resolve(this.allUsersToArray()) : this.requestUsers();
  }

  public getUserById(id: number): Promise<User> {
    return this._usersById.get(id) ? Promise.resolve(this._usersById.get(id)) : this.requestUser(id);
  }

  public addUser(user: User): Promise<User> {
    return this.http
      .post('/api/user', user)
      .then(res => {
        this._usersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateLocation (user : User, locationId: number){
    if (this._usersById.get(user.id)){
      user.locationId = locationId;
      return this.http
        .put('/api/user',user).then( res => {
          this._usersById.set(user.id,res.data);
          return res.data;
        })
    }
    else {
      this.requestUser(user.id).then(res => this.updateLocation(user,locationId));
    }
  }

  public getUserReportStatistics(userId: number){
      return this.http
        .get('/api/report/statistics/'+userId).then( res => {
          return res.data;
        })
  }

  public updateUser(user: any): Promise<User> {
    if(this._usersById.get(user.id)) {
      return this.http
        .put('/api/user', user)
        .then(res => {
          this._usersById.set(user.id, res.data);
          return res.data;
        });
    } else {
      this.requestUser(user.id).then(res => this.updateUser(user));
    }
  }

  public deleteUser(id: number): Promise<any> {
    return this.http.delete('/api/user/' + id)
      .then(res => {
        this._usersById.delete(id);
        return res;
      });
  }

  private allUsersToArray(): User[] {
    return Array.from(this._usersById.values());
  }

  private requestUsers(): Promise<User[]> {
    return this.http
      .get('/api/user/all')
      .then(res => {
        const users = res.data as User[];
        users.forEach(user => this._usersById = this._usersById.set(user.id, user));
        this._allUsersLoaded = true;
        return this.allUsersToArray();
      });
  }

  private requestUser(id: number): Promise<User> {
    return this.http
      .get('/api/user/id/' + id)
      .then(res => {
        this._usersById.set(id,res.data);
        return res.data;
      });
  }
}
