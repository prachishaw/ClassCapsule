// This line imports basic Angular features for components
import { Component } from '@angular/core';

// This helps use common features like *ngIf, *ngFor in HTML
import { CommonModule } from '@angular/common';

// These help us build and manage a form, like a login form
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Helps us move between pages (routing)
import { Router } from '@angular/router';

// These are Material Design modules for good-looking cards, forms, buttons, etc.
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// This is our custom service that handles login logic (like calling an API)
import { AuthService } from '../../services/auth.service';

@Component({
  // This name is used in HTML to call or load this component
  selector: 'app-login',

  // This makes the component work without needing to register it in app.module.ts
  standalone: true,

  // These are the helper modules this component will use
  imports: [
    CommonModule, // For using common Angular stuff
    ReactiveFormsModule, // For working with reactive forms
    MatCardModule, // For a nice card layout
    MatFormFieldModule, // For input fields
    MatInputModule, // For regular text input
    MatButtonModule, // For buttons
    MatIconModule, // For using icons
    MatProgressSpinnerModule // For showing a loading spinner
  ],

  // This is the file that contains the HTML layout for this component
  templateUrl: './login.component.html',

  // This file contains CSS styles to make the component look nice
  styleUrls: ['./login.component.css']
})

// This is the class that contains the real logic for the login component
export class LoginComponent {
  // This holds the login form and its fields (email, password)
  loginForm: FormGroup;

  // This controls whether password is hidden or shown
  hidePassword = true;

  // This shows a loading spinner when login is processing
  loading = false;

  // Constructor runs when the component is created
  constructor(
    private fb: FormBuilder, // Used to build the login form
    private authService: AuthService, // Our login service (sends request to server)
    private router: Router // Helps to go to other pages
  ) {
    // This sets up the form with 2 fields: email and password
    this.loginForm = this.fb.group({
      // Email is required and should be in correct format
      email: ['', [Validators.required, Validators.email]],
      
      // Password is required
      password: ['', [Validators.required]]
    });
  }

  // This function runs when user clicks the login button
  onSubmit(): void {
    // Check if the form is filled properly
    if (this.loginForm.valid) {
      this.loading = true; // Show loading spinner
      
      // Get the values entered by the user
      const { email, password } = this.loginForm.value;

      // Call the login function from our service with email and password
      this.authService.login(email, password).subscribe({
        next: (success) => { // If login is successful
          this.loading = false; // Hide loading spinner

          if (success) {
            this.router.navigate(['/dashboard']); // Go to dashboard page
          }
        },
        error: () => {
          this.loading = false; // Stop loading if there's an error
        }
      });
    }
  }

  // This function runs when user clicks on "Register" button
  goToRegister(): void {
    this.router.navigate(['/register']); // Take user to the register page
  }
}
