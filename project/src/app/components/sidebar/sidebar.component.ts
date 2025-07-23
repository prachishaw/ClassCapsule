// Importing the basic tools to create an Angular component
import { Component } from '@angular/core';

// CommonModule gives us access to basic Angular features like *ngIf and *ngFor
import { CommonModule } from '@angular/common';

// RouterModule allows us to link to different pages (routes)
import { RouterModule } from '@angular/router';

// Importing UI elements from Angular Material
import { MatButtonModule } from '@angular/material/button'; // For using buttons
import { MatIconModule } from '@angular/material/icon'; // For using material icons
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // For the theme toggle switch
import { MatFormFieldModule } from '@angular/material/form-field'; // For form field styling
import { MatSelectModule } from '@angular/material/select'; // For dropdowns (profile switching)

// Importing the AuthService and User model to manage user data
import { AuthService, User } from '../../services/auth.service';

// Importing ThemeService to switch between light and dark mode
import { ThemeService } from '../../services/theme.service';

// Router is used to move between pages
import { Router } from '@angular/router';

// Declaring this class as an Angular component
@Component({
  selector: 'app-sidebar', // This is the custom tag name for this component
  standalone: true, // This tells Angular it doesn't belong to a module file
  imports: [ // List of modules and components this one depends on
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './sidebar.component.html', // Path to the HTML layout file
  styleUrls: ['./sidebar.component.css'] // Path to the CSS styling file
})

// The main class for SidebarComponent where all the logic goes
export class SidebarComponent {
  // Stores the currently logged-in user
  currentUser: User | null = null;

  // Tracks whether dark mode is enabled
  isDarkMode = false;

  // Tracks which profile is selected in the dropdown
  selectedProfile: string = 'teacher';

  // The constructor sets up the component and injects services we need
  constructor(
    private authService: AuthService, // To manage user data and login/logout
    private themeService: ThemeService, // To switch between light/dark themes
    private router: Router // To navigate to different pages
  ) {
    // Subscribe to changes in the current user and update local variable
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Listen for dark mode changes from the ThemeService
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Set the selected profile from the logged-in user's role
    if (this.currentUser) {
      this.selectedProfile = this.currentUser.role;
    }
  }

  // This method toggles between light and dark mode
  toggleTheme(): void {
    this.themeService.toggleTheme(); // Calls the toggle function in the theme service
  }

  // Logs the user out and redirects to login page
  logout(): void {
    this.authService.logout(); // Clears user info
    this.router.navigate(['/login']); // Takes the user to login page
  }

  // Simulates switching roles by loading a demo user for each profile
  switchProfile(role: string): void {
    // A list of demo users for each role
    const demoUsers = {
      student: {
        id: 'demo-student',
        email: 'student@demo.com',
        name: 'Alex Student',
        role: 'student' as const,
        profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
        department: 'Computer Science'
      },
      teacher: {
        id: 'demo-teacher',
        email: 'teacher@demo.com',
        name: 'Dr. Sarah Johnson',
        role: 'teacher' as const,
        profileImage: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop&crop=face',
        department: 'Mathematics'
      },
      administrator: {
        id: 'demo-admin',
        email: 'admin@demo.com',
        name: 'Michael Admin',
        role: 'administrator' as const,
        profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face'
      },
      alumni: {
        id: 'demo-alumni',
        email: 'alumni@demo.com',
        name: 'Jessica Alumni',
        role: 'alumni' as const,
        profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
        department: 'Business Administration',
        graduationYear: 2020
      }
    };

    // Pick the right user from the demo list
    const selectedUser = demoUsers[role as keyof typeof demoUsers];

    // If user exists, simulate logging in as that profile
    if (selectedUser) {
      this.authService.setDemoUser(selectedUser); // Set new user data
      this.selectedProfile = role; // Update the selected profile
    }
  }

  // Converts the role ID (like "teacher") into a nicer display name
  getRoleDisplayName(role?: string): string {
    const roleNames = {
      'student': 'Student',
      'teacher': 'Teacher',
      'administrator': 'Administrator',
      'alumni': 'Alumni'
    };
    // Return the human-readable name or fallback to empty string
    return role ? roleNames[role as keyof typeof roleNames] || role : '';
  }
}
