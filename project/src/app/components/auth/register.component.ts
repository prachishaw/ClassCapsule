// Import tools and features from Angular core and libraries
import { Component } from '@angular/core'; // Allows us to create a component
import { CommonModule } from '@angular/common'; // Basic Angular features
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // For creating forms
import { Router } from '@angular/router'; // For moving between pages

// Import Angular Material UI modules to make the page look nice
import { MatCardModule } from '@angular/material/card'; // For card layout
import { MatFormFieldModule } from '@angular/material/form-field'; // For input fields
import { MatInputModule } from '@angular/material/input'; // For text input
import { MatButtonModule } from '@angular/material/button'; // For buttons
import { MatIconModule } from '@angular/material/icon'; // For icons (like eye symbol)
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading spinner
import { MatSelectModule } from '@angular/material/select'; // For dropdown menu

// Import our own service that talks to the backend
import { AuthService } from '../../services/auth.service'; // Handles login/register actions

// Define a new component (a screen)
@Component({
  selector: 'app-register', // HTML tag to use this component
  standalone: true, // We can use it without needing to add it to a module
  imports: [ // Tools we are using inside this component
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html', // HTML part of this screen
  styleUrls: ['./register.component.css'] // CSS (design) part of this screen
})
export class RegisterComponent {
  registerForm: FormGroup; // This holds all the form input fields
  hidePassword = true; // Used to hide/show password text
  hideConfirmPassword = true; // Used to hide/show confirm password text
  loading = false; // Show spinner while waiting
  graduationYears: number[] = []; // List of years to choose from

  constructor(
    private fb: FormBuilder, // Tool to help us create forms
    private authService: AuthService, // Service that talks to the backend
    private router: Router // Helps us switch pages
  ) {
    // Create the form with input fields and rules (validators)
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]], // Name is required
      role: ['', [Validators.required]], // Role is required (student, teacher, etc.)
      department: [''], // Department (optional for now)
      graduationYear: [''], // Graduation year (optional for now)
      email: ['', [Validators.required, Validators.email]], // Email must be valid
      password: ['', [Validators.required, Validators.minLength(6)]], // Password must be at least 6 characters
      confirmPassword: ['', [Validators.required]] // Must confirm the password
    }, { validators: this.passwordMatchValidator }); // Add custom rule: both passwords must match

    // Create a list of graduation years from now +10 to now -50
    const currentYear = new Date().getFullYear(); // Get the current year
    for (let year = currentYear + 10; year >= currentYear - 50; year--) {
      this.graduationYears.push(year); // Add each year to the list
    }

    // If the user changes their role (student, teacher, alumni), update what fields are required
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFieldValidators(role); // Call function to update field rules
    });
  }

  // This function changes which fields are required based on role
  updateFieldValidators(role: string) {
    const departmentControl = this.registerForm.get('department'); // Get department field
    const graduationControl = this.registerForm.get('graduationYear'); // Get graduation year field

    if (role === 'alumni') { // If role is alumni
      departmentControl?.setValidators([Validators.required]); // Make department required
      graduationControl?.setValidators([Validators.required]); // Make graduation year required
    } else if (role === 'student' || role === 'teacher') { // For student or teacher
      departmentControl?.setValidators([Validators.required]); // Only department is required
      graduationControl?.clearValidators(); // Graduation year not needed
    } else { // Any other role
      departmentControl?.clearValidators(); // No required fields
      graduationControl?.clearValidators();
    }

    // Update the form to know about the new rules
    departmentControl?.updateValueAndValidity();
    graduationControl?.updateValueAndValidity();
  }

  // This checks if we should show the department field based on the role
  showDepartmentField(): boolean {
    const role = this.registerForm.get('role')?.value; // Get the selected role
    return role === 'student' || role === 'teacher' || role === 'alumni'; // Show for these roles
  }

  // This checks if we should show the graduation year field (only for alumni)
  showGraduationField(): boolean {
    const role = this.registerForm.get('role')?.value;
    return role === 'alumni';
  }

  // This is a custom rule that checks if password and confirmPassword are the same
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password'); // Get password field
    const confirmPassword = form.get('confirmPassword'); // Get confirm password field

    // If both fields are filled but don’t match, return an error
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true }; // This is an error object
    }
    return null; // No errors
  }

  // When user clicks the Register button
  onSubmit(): void {
    if (this.registerForm.valid) { // Make sure form is filled correctly
      this.loading = true; // Show loading spinner

      // Get all the values from the form
      const { email, password, name, role, department, graduationYear } = this.registerForm.value;

      // Ask the backend to create the new account
      this.authService.register(email, password, name, role, department, graduationYear).subscribe({
        next: (success) => { // When response comes back
          this.loading = false; // Hide loading spinner
          if (success) {
            this.router.navigate(['/dashboard']); // Go to dashboard if it worked
          }
        },
        error: () => {
          this.loading = false; // Hide spinner if something went wrong
        }
      });
    }
  }

  // When user clicks “Already have an account?”, go to login page
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
