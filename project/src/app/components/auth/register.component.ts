import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;               // Form group for registration
  hidePassword = true;                   // Toggle for hiding password
  hideConfirmPassword = true;            // Toggle for hiding confirm password
  loading = false;                       // Loading spinner toggle
  graduationYears: number[] = [];        // Array of graduation year options

  constructor(
    private fb: FormBuilder,             // FormBuilder to create form controls
    private authService: AuthService,    // AuthService for backend registration
    private router: Router               // Router for navigation
  ) {
    // Initialize the form with controls and validators
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      department: [''],
      graduationYear: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); // Custom validator for password match

    // Generate a range of graduation years: currentYear +10 down to currentYear -50
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 10; year >= currentYear - 50; year--) {
      this.graduationYears.push(year);
    }

    // Subscribe to role changes to adjust form field requirements dynamically
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFieldValidators(role);
    });
  }

  // Adjust department and graduation year validators based on role
  updateFieldValidators(role: string) {
    const departmentControl = this.registerForm.get('department');
    const graduationControl = this.registerForm.get('graduationYear');

    if (role === 'alumni') {
      departmentControl?.setValidators([Validators.required]);
      graduationControl?.setValidators([Validators.required]);
    } else if (role === 'student' || role === 'teacher') {
      departmentControl?.setValidators([Validators.required]);
      graduationControl?.clearValidators();
    } else {
      departmentControl?.clearValidators();
      graduationControl?.clearValidators();
    }

    // Update the validity status after changing validators
    departmentControl?.updateValueAndValidity();
    graduationControl?.updateValueAndValidity();
  }

  // Show department field for roles that require it
  showDepartmentField(): boolean {
    const role = this.registerForm.get('role')?.value;
    return role === 'student' || role === 'teacher' || role === 'alumni';
  }

  // Show graduation year field only for alumni
  showGraduationField(): boolean {
    const role = this.registerForm.get('role')?.value;
    return role === 'alumni';
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Submit handler for the registration form
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const { email, password, name, role, department, graduationYear } = this.registerForm.value;

      // Call AuthService to register the user
      this.authService.register(email, password, name, role, department, graduationYear).subscribe({
        next: (success) => {
          this.loading = false;
          if (success) {
            // Redirect to dashboard upon successful registration
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          // Handle errors and stop loading spinner
          this.loading = false;
        }
      });
    }
  }

  // Navigate to login screen
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
