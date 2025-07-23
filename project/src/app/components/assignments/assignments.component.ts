// 📦 Importing tools needed to build and run the component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// 🧱 Importing buttons, cards, icons, and chips from Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

// 📡 Importing data service and models (Assignment and Course types)
import { DataService } from '../../services/data.service';
import { Assignment, Course } from '../../models/course.model';

// 🧩 This defines the component (like saying “this is a screen/page”)
@Component({
  selector: 'app-assignments', // 🔍 This is the name used in HTML to show this component
  standalone: true, // 🧍 This component works on its own
  // 🧰 These are other tools this component needs to work properly
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './assignments.component.html', // 📄 This is the HTML file connected to this component
  styleUrls: ['./assignments.component.css']   // 🎨 This is the CSS file to style the component
})
export class AssignmentsComponent implements OnInit {

  // 📚 These are empty lists to store data we’ll get from the service
  assignments: Assignment[] = [];
  courses: Course[] = [];

  // 🧪 The service is added so we can use it to get data
  constructor(private dataService: DataService) {}

  /**
   * 🚀 This runs when the page first opens
   */
  ngOnInit() {
    // 📥 Get all the assignments from the backend
    this.dataService.getAssignments().subscribe(assignments => {
      this.assignments = assignments; // 🧺 Store them in the assignments list
    });

    // 📥 Get all the courses from the backend
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses; // 🧺 Store them in the courses list
    });
  }

  /**
   * 🏷️ Finds the course name using its ID
   * @param courseId - The ID of the course
   * @returns The title of the course or "Unknown Course" if not found
   */
  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId); // 🔍 Find the course
    return course ? course.title : 'Unknown Course'; // 🏷️ Return title or 'Unknown'
  }

  /**
   * 🎨 Finds the color for a course using its ID
   * @param courseId - The ID of the course
   * @returns The color of the course or a default gray
   */
  getCourseColor(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId); // 🔍 Find the course
    return course ? course.color : '#6B7280'; // 🎨 Return color or a gray fallback
  }

  /**
   * 🗓️ Tells how much time is left or overdue for a date
   * @param date - The due date of the assignment
   * @returns A friendly message like "Due tomorrow" or "2 days overdue"
   */
  formatDueDate(date: Date): string {
    const now = new Date(); // 📅 Get today's date
    const diffTime = date.getTime() - now.getTime(); // 🔢 Get time difference
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 📏 Change milliseconds into days

    // 🧠 Decide what to say based on how many days are left or late
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  }

  /**
   * ❗ Checks if the assignment is late
   * @param date - The due date
   * @returns true if it's past the current date
   */
  isOverdue(date: Date): boolean {
    return date.getTime() < new Date().getTime(); // ⏰ True if due date is before now
  }

  /**
   * ⬆️ Submits an assignment by telling the service to change its status
   * @param assignmentId - ID of the assignment to submit
   */
  submitAssignment(assignmentId: string) {
    this.dataService.updateAssignmentStatus(assignmentId, 'submitted'); // 🔄 Change the status to 'submitted'
  }
}
