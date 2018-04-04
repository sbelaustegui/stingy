import {Component, OnInit} from '@angular/core';
import {HttpService} from "./shared/services/http.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})
export class AppComponent implements OnInit{

  user: User;

  constructor(private http: HttpService) {

  }

  ngOnInit(): void {
    this.user = User.empty();
    this.http.get('/api/user/all').then(res => {
      console.log(res);
    })
  }
  addUser(){
    this.http.post('api/user', this.user).then(res=>{
      console.log(res);
    }).catch(err => {console.log(err)})
  }

}

class User{

  static empty(): User{
    return new User('', '', '', '', '')
  }
  constructor(public name: string, public username: string, public password: string, public lastName: string, public email: string) {}
}
