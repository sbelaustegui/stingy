import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserAuthService} from './user-auth.service';

@Injectable()
export class ReverseUserAuthGuard implements CanActivate {

    constructor(private authService: UserAuthService, private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    public checkLogin(url: string): boolean {
      if (!this.authService.isLoggedIn) { return true; }
      this.router.navigate(['user', 'profile']);
      return false;
    }
}
