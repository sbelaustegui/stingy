export class Supplier{

  static empty(): Supplier{
    return new Supplier('', '', Location.empty())
  }
  constructor(public name: string, public description: string, public location: Location, public id?: number) {}
}

class Location {
  static empty(): Location{
    return new Location(0, 0)
  }
  constructor(public latitude: number, public longitude: number, public id?: number) {}
}
