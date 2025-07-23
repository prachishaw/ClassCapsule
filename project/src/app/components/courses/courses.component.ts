// This part brings in necessary tools from Angular and Material UI
import { Component, OnInit } from '@angular/core'; // Helps make components and do something when the page loads
import { CommonModule } from '@angular/common'; // Lets us use common Angular features like *ngIf or *ngFor
import { MatButtonModule } from '@angular/material/button'; // Lets us use fancy Material Design buttons
import { MatCardModule } from '@angular/material/card'; // Lets us use card-style boxes to show items
import { MatIconModule } from '@angular/material/icon'; // Lets us show icons like stars, books, etc.
import { MatFormFieldModule } from '@angular/material/form-field'; // Helps create form input boxes nicely
import { MatInputModule } from '@angular/material/input'; // Lets users type inside input fields

// We also need our own files to get course data and define what a course is
import { DataService } from '../../services/data.service'; // A service that gives us course data
import { Course } from '../../models/course.model'; // Defines what a Course looks like (title, id, etc.)

// Now we define the component (the Courses page)
@Component({
  selector: 'app-courses', // This is the tag name we use in HTML to show this component
  standalone: true, // This means it works alone without being part of a module
  imports: [ // These are all the tools we need to use in this component
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './courses.component.html', // This tells Angular where the HTML file is
  styleUrls: ['./courses.component.css'] // This tells Angular where the CSS (styling) file is
})
export class CoursesComponent implements OnInit {
  // This makes an empty list that will later hold the courses
  courses: Course[] = [];

  // This sets up a way to talk to the data service (used to get courses)
  constructor(private dataService: DataService) { }

  // This runs when the page is first shown
  ngOnInit() {
    // We ask the data service to give us all the courses
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses; // When the data arrives, we save it in the `courses` list
    });
  }

  // This function checks what the course title is and gives a matching icon
  getSubjectIcon(title: string): string {
    // If the course is about math, we return a triangle icon
    if (title.toLowerCase().includes('math')) return '📐';

    // If the course is about computers or programming, return a computer icon
    if (title.toLowerCase().includes('computer') || title.toLowerCase().includes('programming')) return '💻';

    // If the course is about design, return a paint palette
    if (title.toLowerCase().includes('design')) return '🎨';

    // If the course is about business, return a briefcase icon
    if (title.toLowerCase().includes('business')) return '💼';

    // For all other courses, return a book icon
    return '📚';
  }
}
