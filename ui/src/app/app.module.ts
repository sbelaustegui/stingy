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
import {AdminAuthService} from "./shared/auth/admin/admin-auth.service";
import { ProfileComponent } from './user/profile/profile.component';
import { CartComponent } from './user/cart/cart.component';
import { UploadProductComponent } from './user/upload-product/upload-product.component';
import { CategoriesComponent } from './admin/admin-user/categories/categories.component';
import { ProductsComponent} from "./admin/admin-user/products/products.component";
import {AdminUserComponent} from "./admin/admin-user/admin-user.component";
import {AdminsComponent} from "./admin/admin-user/admins/admins.component";
import {AdminProfileComponent} from "./admin/admin-user/admin-profile/admin-profile.component";
import { ModalModule } from 'ngx-bootstrap/modal';
import {NgxPaginationModule} from 'C:/Users/manza/projects/stingy/ui/node_modules/ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NewUserComponent,
    UserComponent,
    HomeComponent,
    AdminComponent,
    AdminLoginComponent,
    ProfileComponent,
    CartComponent,
    UploadProductComponent,
    CategoriesComponent,
    AdminUserComponent,
    AdminsComponent,
    AdminProfileComponent,
    ProductsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  providers : [
    CookieService,
    HttpService,
    UserAuthService,
    AdminAuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
