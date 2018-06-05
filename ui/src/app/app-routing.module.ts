import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {LoginComponent} from "./login/login.component";
import {NewUserComponent} from "./new-user/new-user.component";
import {ReverseUserAuthGuard} from "./shared/auth/user/reverse-user-auth-guard.service";
import {UserAuthGuard} from "./shared/auth/user/user-auth-guard.service";
import {HomeComponent} from "./user/home/home.component";
import {UserComponent} from "./user/user.component";
import {AdminComponent} from "./admin/admin.component";
import {AdminLoginComponent} from "./admin/login/login.component";
import {ReverseAdminAuthGuard} from "./shared/auth/admin/reverse-admin-auth-guard.service";
import {AdminAuthGuard} from "./shared/auth/admin/admin-auth-guard.service";
import {ProfileComponent} from "./user/profile/profile.component";
import {CartComponent} from "./user/cart/cart.component";
import {UploadProductComponent} from "./user/upload-product/upload-product.component";
import {CategoriesComponent} from "./admin/admin-user/categories/categories.component";
import {AdminUserComponent} from "./admin/admin-user/admin-user.component";
import {AdminsComponent} from "./admin/admin-user/admins/admins.component";
import {AdminProfileComponent} from "./admin/admin-user/admin-profile/admin-profile.component";
import {ProductsComponent} from "./admin/admin-user/products/products.component";
import {SuppliersComponent} from "./admin/admin-user/suppliers/suppliers.component";
import {HistoryComponent} from "./user/cart/history/history.component";

const routes: Routes =[
  {
    path: '',                                                         component: AppComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'login'},
      {path: 'login', canActivate: [ReverseUserAuthGuard],            component: LoginComponent},
      {path: 'new-user',                                              component: NewUserComponent},
      {path: 'user', canActivate: [UserAuthGuard],                    component: UserComponent,
        children: [
          {path: '', pathMatch: 'full', redirectTo: 'home'},
          {path: 'home',                                              component: HomeComponent},
          {path: 'profile',                                           component: ProfileComponent},
          {path: 'cart',
            children: [
              {path: '',                                              component: CartComponent},
              {path: 'history',                                       component: HistoryComponent},
            ]
          },
          {path: 'upload-product',                                    component: UploadProductComponent},
        ]
      },
      {path: 'admin',                                                 component: AdminComponent,
        children: [
          {path: 'login',  canActivate: [ReverseAdminAuthGuard],      component: AdminLoginComponent},
          {path: 'admin-user', canActivate: [AdminAuthGuard],         component: AdminUserComponent,
            children: [
              {path: 'categories',                                    component: CategoriesComponent},
              {path: 'users',                                         component: AdminsComponent},
              {path: 'admin-profile',                                 component: AdminProfileComponent},
              {path: 'products',                                      component: ProductsComponent},
              {path: 'suppliers',                                     component: SuppliersComponent},
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
  providers : [
    ReverseUserAuthGuard,
    UserAuthGuard,
    ReverseAdminAuthGuard,
    AdminAuthGuard
  ]
})
export class AppRoutingModule { }
