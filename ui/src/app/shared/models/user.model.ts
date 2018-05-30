export class User {

  static empty(): User {
    return new User('', '', '', '', '',Location.empty().id)
  }

  constructor(public name: string, public username: string, public password: string,
              public lastName: string, public email: string, public locationId: number,
              public id?: number) {
  }
}

class Location {
  static empty(): Location {
    return new Location(0, 0)
  }

  constructor(public latitude: number, public longitude: number, public id?: number) {
  }
}
