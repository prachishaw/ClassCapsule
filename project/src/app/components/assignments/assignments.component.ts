import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// Services and Models
import { DataService } from '../../services/data.service';
import { Assignment, Course } from '../../models/course.model';

@Component({
  selector: 'app-assignments',
  standalone: true,
  // Importing required modules for this standalone component
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

  // Arrays to store assignments and courses fetched from the data service
  assignments: Assignment[] = [];
  courses: Course[] = [];

  constructor(private dataService: DataService) {}

  /**
   * Lifecycle hook: Called once the component is initialized.
   * Fetches assignments and course data from the backend service.
   */
  ngOnInit() {
    // Fetch assignment data
    this.dataService.getAssignments().subscribe(assignments => {
      this.assignments = assignments;
    });

    // Fetch course data
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses;
    });
  }

  /**
   * Returns the title of the course by matching the course ID.
   * @param courseId - ID of the course
   * @returns Course title or a fallback string
   */
  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  }

  /**
   * Returns the associated color for a course using its ID.
   * @param courseId - ID of the course
   * @returns Course color or a default gray color
   */
  getCourseColor(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.color : '#6B7280'; // Default Tailwind gray
  }

  /**
   * Formats the due date in a user-friendly way.
   * @param date - Due date of the assignment
   * @returns A string indicating how many days left or overdue
   */
  formatDueDate(date: Date): string {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  }

  /**
   * Checks whether the given date is past the current date.
   * @param date - Date to compare
   * @returns True if overdue, otherwise false
   */
  isOverdue(date: Date): boolean {
    return date.getTime() < new Date().getTime();
  }

  /**
   * Submits the assignment by updating its status.
   * @param assignmentId - ID of the assignment to be submitted
   */
  submitAssignment(assignmentId: string) {
    this.dataService.updateAssignmentStatus(assignmentId, 'submitted');
  }
}
