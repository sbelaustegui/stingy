import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {User} from "../models/user.model";

/*
# Admin
POST        /api/admin                                          controllers.AdminController.register
GET         /api/admin/id/:id                                   controllers.AdminController.getById(id: Long)
GET         /api/admin/all                                      controllers.AdminController.getAll
PUT         /api/admin                                          controllers.AdminController.update
DELETE      /api/admin/:id                                      controllers.AdminController.delete(id: Long)
*/

@Injectable()
export class AdminService {

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
      .post('/api/admin', user)
      .then(res => {
        this._usersById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateUser(user: User): Promise<User> {
    if(this._usersById.get(user.id)) {
      return this.http
        .put('/api/admin', user)
        .then(res => {
          this._usersById.set(user.id, res.data);
          return res.data;
        });
    } else {
      this.requestUser(user.id).then(res => this.updateUser(user));
    }
  }

  public deleteUser(id: number): Promise<any> {
    return this.http.delete('/api/admin/' + id)
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
      .get('/api/admin/all')
      .then(res => {
        const users = res.data as User[];
        users.forEach(user => this._usersById = this._usersById.set(user.id, user));
        this._allUsersLoaded = true;
        return this.allUsersToArray();
      });
  }

  private requestUser(id: number): Promise<User> {
    return this.http
      .get('/api/admin/id/' + id)
      .then(res => {
        this._usersById.set(id,res.data);
        return res.data;
      });
  }
}
