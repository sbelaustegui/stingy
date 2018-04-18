import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import { LoginComponent } from './login/login.component';
import { NewUserComponent } from './new-user/new-user.component';
import {HomeComponent} from "./user/home/home.component";
import {UserComponent} from "./user/user.component";
import {UserAuthService} from "./shared/auth/user/user-auth.service";
import {HttpService} from "./shared/services/http.service";
import {CookieService} from "angular2-cookie/core";
import { AdminComponent } from './admin/admin.component';
import {AdminLoginComponent} from "./admin/login/login.component";
import {AdminHomeComponent} from "./admin/home/home.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewUserComponent,
    UserComponent,
    HomeComponent,
    AdminComponent,
    AdminLoginComponent,
    AdminHomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
  ],
  providers : [
    CookieService,
    HttpService,
    UserAuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
