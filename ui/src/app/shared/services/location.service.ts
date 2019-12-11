import {HttpService} from "./http.service";
import {Injectable} from '@angular/core';
import {Location} from "../models/location.model";

/*
# Location
POST        /api/location                                       controllers.LocationController.register()
GET         /api/location/id/:id                                controllers.LocationController.getById(id: Long)
PUT         /api/location                                       controllers.LocationController.update()
DELETE      /api/location/:id                                   controllers.LocationController.delete(id: Long)
*/

@Injectable()
export class LocationService {

  private _allLocationsLoaded: boolean;
  private _locationsById: Map<number, Location>;

  constructor(private http: HttpService) {
    this._allLocationsLoaded = false;
    this._locationsById = new Map();
  }

  get locations(): Promise<Location[]> {
    return this._allLocationsLoaded ? Promise.resolve(this.allLocationsToArray()) : this.requestLocations();
  }

  public getLocationById(id: number): Promise<Location> {
    return this._locationsById.get(id) ? Promise.resolve(this._locationsById.get(id)) : this.requestLocation(id);
  }

  public addLocation(location: Location): Promise<Location> {
    return this.http
      .post('/api/location', location)
      .then(res => {
        this._locationsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public addUserLocation(location: Location, userId: number): Promise<Location> {
    location.userId = userId;
    return this.http
      .post('/api/location/user', location)
      .then(res => {
        this._locationsById.set(res.data.id, res.data);
        return res.data;
      });
  }

  public updateLocation(location: Location): Promise<Location> {
    if(this._locationsById.get(location.id)) {
      return this.http
        .put('/api/location', location)
        .then(res => {
          this._locationsById.set(location.id, res.data);
          return res.data;
        });
    } else {
      this.requestLocation(location.id).then(res => this.updateLocation(location));
    }
  }

  public deleteLocation(id: number): Promise<any> {
    return this.http.delete('/api/location/' + id)
      .then(res => {
        this._locationsById.delete(id);
        return res;
      });
  }

  private allLocationsToArray(): Location[] {
    return Array.from(this._locationsById.values());
  }

  private requestLocations(): Promise<Location[]> {
    return this.http
      .get('/api/location/all')
      .then(res => {
        const locations = res.data as Location[];
        locations.forEach(location => this._locationsById = this._locationsById.set(location.id, location));
        this._allLocationsLoaded = true;
        return this.allLocationsToArray();
      });
  }

  private requestLocation(id: number): Promise<Location> {
    return this.http
      .get('/api/location/id/' + id)
      .then(res => {
        this._locationsById.set(id,res.data);
        return res.data;
      });
  }
}
