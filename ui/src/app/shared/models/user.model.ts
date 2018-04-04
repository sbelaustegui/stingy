class User{

  static empty(): User{
    return new User('', '', '', '', '')
  }
  constructor(public name: string, public username: string, public password: string, public lastName: string, public email: string, public id?: number) {}
}
