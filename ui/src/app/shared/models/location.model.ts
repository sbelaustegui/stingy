export class Location{

  static empty(): Location{
    return new Location('', 0, 0)
  }
  constructor(public name: string, public latitude: number, public longitude: number) {}
}
