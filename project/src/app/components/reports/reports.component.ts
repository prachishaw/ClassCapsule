// Importing necessary tools from Angular core
import { Component, OnInit } from '@angular/core';
// CommonModule lets us use common Angular features like *ngFor, *ngIf
import { CommonModule } from '@angular/common';
// Importing button UI module
import { MatButtonModule } from '@angular/material/button';
// Importing card UI module
import { MatCardModule } from '@angular/material/card';
// Importing icon UI module
import { MatIconModule } from '@angular/material/icon';
// Importing form field UI module
import { MatFormFieldModule } from '@angular/material/form-field';
// Importing dropdown (select) UI module
import { MatSelectModule } from '@angular/material/select';
// Importing data service to get courses data
import { DataService } from '../../services/data.service';
// Importing Course model structure
import { Course } from '../../models/course.model';

// Describing how each student's performance will look like
interface StudentPerformance {
  name: string;       // Student's name
  course: string;     // Course name
  grade: number;      // Grade percentage
  progress: number;   // Progress percentage
  avatar: string;     // Link to student's avatar image
}

// Describing how each course progress will look like
interface CourseProgress {
  name: string;        // Course name
  completion: number;  // Completion percentage
  color: string;       // Color for chart bar
}

// Describing what activity means (like a submission, grade, etc.)
interface Activity {
  title: string;                   // Title of the activity
  description: string;             // Short explanation of what happened
  time: string;                    // When it happened
  type: 'submission' | 'grade' | 'assignment'; // Type of activity
  status: 'completed' | 'pending' | 'graded';  // Current status
}

// Declaring the ReportsComponent with details
@Component({
  selector: 'app-reports',      // HTML tag name to use this component
  standalone: true,             // This component works independently
  imports: [                    // Modules we are importing to use UI components
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './reports.component.html',    // Link to the HTML layout file
  styleUrls: ['./reports.component.css']      // Link to the CSS styling file
})
export class ReportsComponent implements OnInit {
  // Variables for dropdown filters
  selectedPeriod = 'month';           // Time filter (like this month)
  selectedCourse = '';                // Selected course filter
  selectedReportType = 'overview';    // Report type (overview by default)

  courses: Course[] = [];             // List of all courses

  // Dashboard statistics (numbers shown on top)
  totalStudents = 156;                // Total number of students
  activeCourses = 8;                  // Number of running courses
  completedAssignments = 342;        // Assignments that are done
  pendingAssignments = 28;           // Assignments that are still due
  averageGrade = 87;                  // Average grade across all students

  // Chart for how much of each course is completed
  courseProgress: CourseProgress[] = [
    { name: 'Advanced Mathematics', completion: 78, color: '#3B82F6' },
    { name: 'Computer Science', completion: 65, color: '#10B981' },
    { name: 'Digital Design', completion: 92, color: '#6366F1' },
    { name: 'Business Strategy', completion: 45, color: '#F59E0B' }
  ];

  // List of top-performing students
  topStudents: StudentPerformance[] = [
    {
      name: 'Jessica Rodriguez',
      course: 'Digital Design',
      grade: 96,
      progress: 92,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Alex Thompson',
      course: 'Computer Science',
      grade: 94,
      progress: 85,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'David Kim',
      course: 'Mathematics',
      grade: 91,
      progress: 78,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Sarah Johnson',
      course: 'Business Strategy',
      grade: 89,
      progress: 82,
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Recent activities like submissions or grading
  recentActivity: Activity[] = [
    {
      title: 'Assignment Submitted',
      description: 'Jessica Rodriguez submitted "Design Portfolio Review"',
      time: '2 hours ago',
      type: 'submission',
      status: 'completed'
    },
    {
      title: 'Grade Posted',
      description: 'Calculus Problem Set #5 has been graded',
      time: '4 hours ago',
      type: 'grade',
      status: 'graded'
    },
    {
      title: 'New Assignment',
      description: 'Algorithm Implementation project assigned',
      time: '1 day ago',
      type: 'assignment',
      status: 'pending'
    },
    {
      title: 'Assignment Submitted',
      description: 'Alex Thompson submitted "Market Research Report"',
      time: '2 days ago',
      type: 'submission',
      status: 'completed'
    }
  ];

  // Constructor where we bring in DataService to get course info
  constructor(private dataService: DataService) {}

  // ngOnInit runs when the component is loaded
  ngOnInit() {
    // Get the list of courses from the backend service
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses;  // Save the courses in the courses list
    });
  }

  // This method returns a class name based on grade (used for color)
  getGradeClass(grade: number): string {
    if (grade >= 90) return 'excellent';  // If 90 or above → excellent
    if (grade >= 80) return 'good';       // If 80 or above → good
    return 'average';                     // Otherwise → average
  }

  // This method picks the right icon for activity type
  getActivityIcon(type: string): string {
    switch (type) {
      case 'submission': return 'upload';      // For submitted items
      case 'grade': return 'grade';            // For grades posted
      case 'assignment': return 'assignment';  // For new assignments
      default: return 'info';                  // For any unknown type
    }
  }
}
