import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AdminAuthService} from './admin-auth.service';

@Injectable()
export class ReverseAdminAuthGuard implements CanActivate {

    constructor(private authService: AdminAuthService, private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    public checkLogin(url: string): boolean {
      if (!this.authService.isLoggedIn) { return true; }
      this.router.navigate(['admin', 'admin-user', 'categories']);
      return false;
    }
}
