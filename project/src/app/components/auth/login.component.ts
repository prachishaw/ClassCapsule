// Import necessary Angular and Material modules
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Import Angular Material UI modules for styling and UI controls
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Import custom authentication service
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login', // Component selector
  standalone: true, // Enables the component to be used without being declared in a module
  imports: [
    // List of imported modules used in this component
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html', // Template file for HTML
  styleUrls: ['./login.component.css'] // CSS file for styling
})
export class LoginComponent {
  loginForm: FormGroup; // Reactive form group for login
  hidePassword = true; // Used to toggle password visibility
  loading = false; // Indicates if a login request is in progress

  constructor(
    private fb: FormBuilder, // FormBuilder for creating form controls
    private authService: AuthService, // Inject AuthService for login API
    private router: Router // Router for navigation after login
  ) {
    // Initialize the login form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with required and email validators
      password: ['', [Validators.required]] // Password field with required validator
    });
  }

  // Function called when the form is submitted
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Show loading spinner
      const { email, password } = this.loginForm.value; // Extract form values

      // Call the login method from AuthService
      this.authService.login(email, password).subscribe({
        next: (success) => {
          this.loading = false; // Stop loading on response
          if (success) {
            this.router.navigate(['/dashboard']); // Navigate to dashboard on success
          }
        },
        error: () => {
          this.loading = false; // Stop loading on error
        }
      });
    }
  }

  // Navigate to the register page when user clicks on "Register" option
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
