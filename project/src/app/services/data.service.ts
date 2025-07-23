// Tells Angular this is a service that can be shared across the app
import { Injectable } from '@angular/core';

// Helps create observable data streams that other parts of the app can watch
import { BehaviorSubject, Observable } from 'rxjs';

// Import the data types we'll use (Course, Assignment, Student)
import { Course, Assignment, Student } from '../models/course.model';

// This marks the service as available throughout the entire app
@Injectable({
  providedIn: 'root'
})
export class DataService {
  // This is a list of sample courses using BehaviorSubject (to allow changes over time)
  private coursesSubject = new BehaviorSubject<Course[]>([
    {
      id: '1',
      title: 'Advanced Mathematics',
      description: 'Calculus, Linear Algebra, and Statistics',
      instructor: 'Dr. Sarah Johnson',
      studentsCount: 24,
      progress: 78, // percentage completed
      color: '#3B82F6', // for UI display
      assignments: 8,
      nextClass: new Date('2025-01-20T10:00:00') // when the next class is scheduled
    },
    {
      id: '2',
      title: 'Computer Science Fundamentals',
      description: 'Programming, Algorithms, and Data Structures',
      instructor: 'Prof. Michael Chen',
      studentsCount: 32,
      progress: 65,
      color: '#10B981',
      assignments: 12,
      nextClass: new Date('2025-01-21T14:00:00')
    },
    {
      id: '3',
      title: 'Digital Design',
      description: 'UI/UX Design Principles and Tools',
      instructor: 'Ms. Emma Davis',
      studentsCount: 18,
      progress: 92,
      color: '#6366F1',
      assignments: 6,
      nextClass: new Date('2025-01-22T09:00:00')
    },
    {
      id: '4',
      title: 'Business Strategy',
      description: 'Strategic Planning and Market Analysis',
      instructor: 'Dr. Robert Wilson',
      studentsCount: 28,
      progress: 45,
      color: '#F59E0B',
      assignments: 10 // This one doesn’t have a nextClass set
    }
  ]);

  // This is a list of sample assignments
  private assignmentsSubject = new BehaviorSubject<Assignment[]>([
    {
      id: '1',
      title: 'Calculus Problem Set #5',
      courseId: '1', // which course it belongs to
      dueDate: new Date('2025-01-25'),
      status: 'pending' // not submitted yet
    },
    {
      id: '2',
      title: 'Algorithm Implementation',
      courseId: '2',
      dueDate: new Date('2025-01-23'),
      status: 'submitted'
    },
    {
      id: '3',
      title: 'Design Portfolio Review',
      courseId: '3',
      dueDate: new Date('2025-01-28'),
      status: 'graded',
      grade: 95 // only present if graded
    },
    {
      id: '4',
      title: 'Market Research Report',
      courseId: '4',
      dueDate: new Date('2025-01-30'),
      status: 'pending'
    }
  ]);

  // This is a list of students with their info
  private studentsSubject = new BehaviorSubject<Student[]>([
    {
      id: '1',
      name: 'Alex Thompson',
      email: 'alex@example.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
      role: 'student',
      courses: ['1', '2'], // enrolled courses by ID
      overallProgress: 85
    },
    {
      id: '2',
      name: 'Jessica Rodriguez',
      email: 'jessica@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
      role: 'student',
      courses: ['2', '3'],
      overallProgress: 92
    },
    {
      id: '3',
      name: 'David Kim',
      email: 'david@example.com',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face',
      role: 'student',
      courses: ['1', '3', '4'],
      overallProgress: 78
    }
  ]);

  // This is the constructor - it's empty for now
  constructor() { }

  // Return the list of all courses as an observable
  getCourses(): Observable<Course[]> {
    return this.coursesSubject.asObservable();
  }

  // Return the list of all assignments as an observable
  getAssignments(): Observable<Assignment[]> {
    return this.assignmentsSubject.asObservable();
  }

  // Return the list of all students as an observable
  getStudents(): Observable<Student[]> {
    return this.studentsSubject.asObservable();
  }

  // Find a course by its ID
  getCourseById(id: string): Course | undefined {
    return this.coursesSubject.value.find(course => course.id === id);
  }

  // Get all assignments that belong to a specific course
  getAssignmentsByCourse(courseId: string): Assignment[] {
    return this.assignmentsSubject.value.filter(assignment => assignment.courseId === courseId);
  }

  // Update the status of an assignment (e.g. from pending to submitted)
  updateAssignmentStatus(assignmentId: string, status: Assignment['status']) {
    const assignments = this.assignmentsSubject.value; // Get current assignments
    const assignmentIndex = assignments.findIndex(a => a.id === assignmentId); // Find the right one

    if (assignmentIndex !== -1) {
      // If the assignment exists, update its status
      assignments[assignmentIndex].status = status;

      // Update the list and notify observers
      this.assignmentsSubject.next([...assignments]);
    }
  }
}
