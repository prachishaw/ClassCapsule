// Import necessary items for routing and guarding routes
import { Routes } from '@angular/router'; // Angular's way to define app routes
import { AuthGuard } from './guards/auth.guard'; // Protects routes from users who are not logged in

// Import components (pages) that will be shown for each route
import { LoginComponent } from './components/auth/login.component'; // Login page
import { RegisterComponent } from './components/auth/register.component'; // Signup/Register page
import { DashboardComponent } from './components/dashboard/dashboard.component'; // Dashboard after login
import { CoursesComponent } from './components/courses/courses.component'; // Courses page
import { AssignmentsComponent } from './components/assignments/assignments.component'; // Assignments page
import { CalendarComponent } from './components/calendar/calendar.component'; // Calendar page
import { ReportsComponent } from './components/reports/reports.component'; // Reports page

// Define the routes that users can visit in the app
export const routes: Routes = [
  { 
    path: '', // If the user visits the root URL (e.g., www.app.com)
    redirectTo: '/login', // Send them to the login page
    pathMatch: 'full' // Make sure the entire path matches
  },
  { 
    path: 'login', // When user goes to /login
    component: LoginComponent // Show the LoginComponent
  },
  { 
    path: 'register', // When user goes to /register
    component: RegisterComponent // Show the RegisterComponent
  },
  { 
    path: 'dashboard', // When user goes to /dashboard
    component: DashboardComponent, // Show the DashboardComponent
    canActivate: [AuthGuard] // Only show if the user is logged in
  },
  { 
    path: 'courses', // When user goes to /courses
    component: CoursesComponent, // Show the CoursesComponent
    canActivate: [AuthGuard] // Only allow if logged in
  },
  { 
    path: 'assignments', // When user goes to /assignments
    component: AssignmentsComponent, // Show the AssignmentsComponent
    canActivate: [AuthGuard] // Only allow if logged in
  },
  { 
    path: 'students', // Placeholder path for students (not built yet)
    component: DashboardComponent, // Temporarily show the dashboard
    canActivate: [AuthGuard] // Only allow if logged in
  },
  { 
    path: 'calendar', // When user goes to /calendar
    component: CalendarComponent, // Show the CalendarComponent
    canActivate: [AuthGuard] // Only allow if logged in
  },
  { 
    path: 'reports', // When user goes to /reports
    component: ReportsComponent, // Show the ReportsComponent
    canActivate: [AuthGuard] // Only allow if logged in
  },
  { 
    path: '**', // If the path does not match any above
    redirectTo: '/login' // Redirect to login page (acts like a fallback)
  }
];
