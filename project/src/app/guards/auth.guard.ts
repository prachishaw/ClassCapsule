// This line says we are using a special Angular feature
import { Injectable } from '@angular/core';

// We use CanActivate to protect routes, and Router to move between pages
import { CanActivate, Router } from '@angular/router';

// We bring in our service that checks if the user is logged in
import { AuthService } from '../services/auth.service';

// This tells Angular that this service can be used anywhere in the app
@Injectable({
  providedIn: 'root' // 'root' means it is available throughout the app
})
export class AuthGuard implements CanActivate { // We are making a class named AuthGuard which protects routes

  // This is a constructor. It creates this class and gives it access to authService and router
  constructor(
    private authService: AuthService, // authService will help us check if the user is logged in
    private router: Router // router helps us move to different pages
  ) {}

  // This method decides if a page should open or not
  canActivate(): boolean {
    // If the user is logged in (true), allow them to continue to the page
    if (this.authService.isAuthenticated) {
      return true; // Yes, allow
    } else {
      // If not logged in, send the user to the login page
      this.router.navigate(['/login']); // Go to login page
      return false; // Do not allow access to the protected page
    }
  }
}
