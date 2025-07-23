// Import basic Angular tools and libraries we need
import { Component, OnInit } from '@angular/core'; // To create component and run code when it starts
import { CommonModule } from '@angular/common'; // Common Angular features like ngIf, ngFor
import { MatButtonModule } from '@angular/material/button'; // For using material buttons
import { MatCardModule } from '@angular/material/card'; // For material cards (pretty boxes)
import { MatIconModule } from '@angular/material/icon'; // For using icons

// Import services and data models
import { DataService } from '../../services/data.service'; // To get course and assignment data
import { AuthService } from '../../services/auth.service'; // To get current user info
import { Course, Assignment } from '../../models/course.model'; // Course and assignment shapes

// Create the component and give it metadata
@Component({
  selector: 'app-dashboard', // This is the tag name for using the component
  standalone: true, // This component doesn't need to be in a module
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule], // These modules are used in this component
  templateUrl: './dashboard.component.html', // This is the HTML part (view)
  styleUrls: ['./dashboard.component.css'] // This is the CSS part (styling)
})
export class DashboardComponent implements OnInit {
  // Define the variables used in the dashboard
  courses: Course[] = []; // List of all courses
  recentAssignments: Assignment[] = []; // List of latest assignments
  totalCourses = 0; // How many courses there are
  totalStudents = 0; // Total number of students
  pendingAssignments = 0; // Assignments not completed yet
  averageProgress = 0; // Average learning progress

  // Use the services to get data and user info
  constructor(
    private dataService: DataService, // To fetch course and assignment data
    private authService: AuthService // To know who is logged in and their role
  ) { }

  // Code that runs when the component is first shown
  ngOnInit() {
    // Get course data from the data service
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses; // Save the courses
      this.totalCourses = courses.length; // Count how many courses
      this.totalStudents = courses.reduce((sum, course) => sum + course.studentsCount, 0); // Add all student numbers
      this.averageProgress = Math.round(
        courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
      ); // Calculate average progress
    });

    // Get assignments and pick the most recent 5
    this.dataService.getAssignments().subscribe(assignments => {
      this.recentAssignments = assignments.slice(0, 5); // Only take first 5
      this.pendingAssignments = assignments.filter(a => a.status === 'pending').length; // Count pending ones
    });

    // Listen for when the user changes (like logging in/out or changing role)
    this.authService.currentUser$.subscribe(user => {
      // Change dashboard based on role
      this.updateDashboardForRole(user?.role);
    });
  }

  // Change the dashboard numbers depending on the user's role
  updateDashboardForRole(role?: string) {
    if (role === 'student') {
      this.totalCourses = 4; // A student might have 4 courses
      this.totalStudents = 0; // Students don’t see other students
      this.pendingAssignments = 3; // They may have 3 pending tasks
    } else if (role === 'administrator') {
      this.totalCourses = 25; // Admin sees all 25 courses
      this.totalStudents = 450; // Admin sees all 450 students
      this.pendingAssignments = 89; // Admin sees all assignments
    } else if (role === 'alumni') {
      this.totalCourses = 0; // Alumni have no current courses
      this.totalStudents = 0; // They don’t see student data
      this.pendingAssignments = 0; // No assignments for them
    }
  }

  // Get the course title by its ID
  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId); // Search for the course
    return course ? course.title : 'Unknown Course'; // Return title or 'Unknown' if not found
  }

  // Format a date into something like "Jul 20"
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  // Show when the next class is (Today, Tomorrow, or in X days)
  formatNextClass(date: Date): string {
    const today = new Date();
    const diff = date.getTime() - today.getTime(); // Time difference in milliseconds
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Convert to days

    if (days === 0) return 'Today'; // If it's today
    if (days === 1) return 'Tomorrow'; // If it's tomorrow
    return `${days} days`; // Else show number of days
  }

  // Get the title shown at the top of the dashboard based on role
  getDashboardTitle(): string {
    const user = this.authService.currentUserValue; // Get logged in user
    const roleNames = {
      'student': 'Student Dashboard',
      'teacher': 'Teacher Dashboard',
      'administrator': 'Admin Dashboard',
      'alumni': 'Alumni Dashboard'
    };
    return user?.role ? roleNames[user.role as keyof typeof roleNames] || 'Dashboard' : 'Dashboard';
  }

  // Get a subtitle below the title based on the role
  getDashboardSubtitle(): string {
    const user = this.authService.currentUserValue;
    const subtitles = {
      'student': 'Track your courses, assignments, and academic progress.',
      'teacher': 'Manage your classes, students, and course materials.',
      'administrator': 'Oversee system operations and user management.',
      'alumni': 'Stay connected with your alma mater and fellow graduates.'
    };
    return user?.role ? subtitles[user.role as keyof typeof subtitles] || 'Welcome back!' : 'Welcome back!';
  }
}
