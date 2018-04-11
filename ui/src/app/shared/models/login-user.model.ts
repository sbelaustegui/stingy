class LoginUser{

  static empty(): LoginUser{
    return new LoginUser('', '')
  }
  constructor(public username: string, public password: string) {}

  public asJson() {
    return {
      username: this.username,
      password: this.password,
    };
  }

  public asJsonString(): string {
    return JSON.stringify(this.asJson());
  }
}
