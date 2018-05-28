export class Location{

  static empty(): Location{
    return new Location(undefined, 0, 0)
  }
  constructor(public id: number, public latitude: number, public longitude: number) {}
}
