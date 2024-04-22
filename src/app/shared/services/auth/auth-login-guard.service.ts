import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // If user is already logged in, redirect to another page, e.g., dashboard
      this.router.navigateByUrl('/dashboard');
      return false; // Return false to cancel navigation to the login page
    } else {
      return true; // Allow navigation to the login page
    }
  }
}
