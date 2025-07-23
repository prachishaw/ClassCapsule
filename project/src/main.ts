// Import the Component decorator to define an Angular component
import { Component } from '@angular/core';

// This function boots (starts) the Angular application
import { bootstrapApplication } from '@angular/platform-browser';

// Used to enable Angular routing (navigating between pages)
import { provideRouter } from '@angular/router';

// Enables animation support in Angular (like fade in/out)
import { provideAnimations } from '@angular/platform-browser/animations';

// Lets us make HTTP requests like GET, POST, etc.
import { provideHttpClient } from '@angular/common/http';

// Common Angular features like *ngIf, *ngFor, etc.
import { CommonModule } from '@angular/common';

// Helps Angular show the right component based on the route
import { RouterOutlet } from '@angular/router';

// This is your sidebar UI component
import { SidebarComponent } from './app/components/sidebar/sidebar.component';

// Service to check if a user is logged in or not
import { AuthService } from './app/services/auth.service';

// All the routes (pages) for your app are defined here
import { routes } from './app/app.routes';

// Define the main component of the app
@Component({
  // The name used in index.html (i.e., <app-root></app-root>)
  selector: 'app-root',

  // This component doesn’t need to be part of a module
  standalone: true,

  // The features this component needs to work (like ngIf, router-outlet, etc.)
  imports: [CommonModule, RouterOutlet, SidebarComponent],

  // The HTML template shown on the screen
  template: `
    <!-- If user is logged in, show full app layout with sidebar -->
    <div class="app-layout" *ngIf="isAuthenticated">
      <!-- Show sidebar only when user is logged in -->
      <app-sidebar *ngIf="isAuthenticated"></app-sidebar>

      <!-- Main content area for each page -->
      <main class="main-content">
        <router-outlet></router-outlet> <!-- Display the current page here -->
      </main>
    </div>

    <!-- If user is NOT logged in, show a different layout (like login page) -->
    <div *ngIf="!isAuthenticated" class="auth-layout">
      <router-outlet></router-outlet> <!-- Show login or register pages -->
    </div>
  `,

  // CSS styles for layout and responsiveness
  styles: [`
    /* Main layout when logged in: sidebar + content */
    .app-layout {
      display: flex;
      min-height: 100vh; /* Full screen height */
    }

    /* Layout when not logged in */
    .auth-layout {
      min-height: 100vh;
    }

    /* Main content area (right of sidebar) */
    .main-content {
      flex: 1; /* Take remaining space */
      margin-left: 280px; /* Leave space for sidebar */
      background-color: var(--neutral-50); /* Light background */
      min-height: 100vh;
    }

    /* For small screens (like phones), remove the sidebar margin */
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
    }
  `]
})

// Define the App class (the main controller for this component)
export class App {
  // Boolean to track if user is logged in
  isAuthenticated = false;

  // Constructor runs when this class is created
  constructor(private authService: AuthService) {
    // Listen for changes to currentUser and update isAuthenticated accordingly
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user; // true if user exists
    });
  }
}

// This is where Angular starts the app using the App component
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),         // Provide all routes
    provideAnimations(),           // Enable animations
    provideHttpClient()            // Enable HTTP requests
  ]
});
