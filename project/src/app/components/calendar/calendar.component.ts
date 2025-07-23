// Importing basic Angular features
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importing UI components from Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

// Importing our own service and data model
import { DataService } from '../../services/data.service';
import { Course } from '../../models/course.model';

// This interface defines what one calendar event looks like
interface CalendarEvent {
  id: string;
  title: string;      // Name of the event (like a class or exam)
  date: Date;         // When the event happens
  time: string;       // Time of the event
  duration: number;   // How long it lasts (in minutes)
  courseId: string;   // Which course it belongs to
  color: string;      // Color used to display it
  type: 'class' | 'assignment' | 'exam' | 'meeting'; // What kind of event it is
}

// This interface defines each day on the calendar
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean; // Is it from the same month we're viewing?
  isToday: boolean;        // Is it today?
  isSelected: boolean;     // Is it selected by the user?
  events: CalendarEvent[]; // What events are on this day
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  // Modules this component will use
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  // Shows which view is selected: month, week, or day
  currentView: 'month' | 'week' | 'day' = 'month';

  // Stores today's date or the date currently being viewed
  currentDate = new Date();

  // The selected course for filtering events
  selectedCourse = '';

  // List of courses from the backend or service
  courses: Course[] = [];

  // All events like classes, meetings, exams, etc.
  events: CalendarEvent[] = [];

  // This will hold the calendar days, grouped by weeks
  calendarWeeks: CalendarDay[][] = [];

  // Stores the current week’s days (used in week view)
  currentWeekDays: any[] = [];

  // Stores upcoming events (used in the sidebar)
  upcomingEvents: CalendarEvent[] = [];

  // Names of the week (used for display)
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Time slots shown in week/day view
  timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  // We bring in the DataService so we can load courses and events
  constructor(private dataService: DataService) {}

  // When the component is ready, run this
  ngOnInit() {
    // Get all courses
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.generateSampleEvents();     // Add some sample events
      this.generateCalendar();         // Build the calendar days
      this.generateUpcomingEvents();   // Show the next few upcoming events
    });
  }

  // This creates some fake events just for testing
  generateSampleEvents() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    this.events = [
      {
        id: '1',
        title: 'Advanced Mathematics',
        date: new Date(year, month, today.getDate() + 1),
        time: '10:00 AM',
        duration: 90,
        courseId: '1',
        color: '#3B82F6',
        type: 'class'
      },
      {
        id: '2',
        title: 'CS Fundamentals Lab',
        date: new Date(year, month, today.getDate() + 2),
        time: '2:00 PM',
        duration: 120,
        courseId: '2',
        color: '#10B981',
        type: 'class'
      },
      {
        id: '3',
        title: 'Design Review',
        date: new Date(year, month, today.getDate() + 3),
        time: '11:00 AM',
        duration: 60,
        courseId: '3',
        color: '#6366F1',
        type: 'meeting'
      },
      {
        id: '4',
        title: 'Midterm Exam',
        date: new Date(year, month, today.getDate() + 5),
        time: '9:00 AM',
        duration: 180,
        courseId: '1',
        color: '#EF4444',
        type: 'exam'
      },
      {
        id: '5',
        title: 'Project Submission',
        date: new Date(year, month, today.getDate() + 7),
        time: '11:59 PM',
        duration: 0,
        courseId: '2',
        color: '#F59E0B',
        type: 'assignment'
      },
      {
        id: '6',
        title: "Prachi's Birthday! 🎂 ",
        date: new Date(year, 7, 10),
        time: 'All Day',
        duration: 0,
        courseId: '',
        color: '#FF69B4',
        type: 'meeting'
      }
    ];
  }

  // This function creates a calendar grid with weeks and days
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get the first day of the current month
    const firstDay = new Date(year, month, 1);

    // Start the calendar from the Sunday before the first day of the month
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarWeeks = [];
    let currentWeek: CalendarDay[] = [];

    // Loop for 6 weeks (6 x 7 = 42 days)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Find events for this day
      const dayEvents = this.events.filter(event =>
        event.date.toDateString() === date.toDateString()
      );

      const calendarDay: CalendarDay = {
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
        isSelected: false,
        events: dayEvents
      };

      currentWeek.push(calendarDay);

      // After 7 days, start a new week
      if (currentWeek.length === 7) {
        this.calendarWeeks.push(currentWeek);
        currentWeek = [];
      }
    }
  }

  // Find the next 5 upcoming events
  generateUpcomingEvents() {
    const today = new Date();
    this.upcomingEvents = this.events
      .filter(event => event.date >= today) // Only future events
      .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by date
      .slice(0, 5); // Only take 5
  }

  // Get the calendar title (like "July 2025" or "July 1 - July 7")
  getCurrentPeriodTitle(): string {
    if (this.currentView === 'month') {
      return this.currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    } else if (this.currentView === 'week') {
      const startOfWeek = new Date(this.currentDate);
      startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      return this.currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }

  // Move calendar to previous month/week/day
  previousPeriod() {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.generateCalendar();
  }

  // Move calendar to next month/week/day
  nextPeriod() {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.generateCalendar();
  }

  // Find the course name by its ID
  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  }

  // Show the date as "Today", "Tomorrow", or a short date
  formatEventDate(date: Date): string {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Figure out how far from the top to place an event (like 2 PM → lower down)
  getEventTop(time: string): number {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour;
    return (adjustedHour - 8) * 60; // Start from 8 AM, 1 hour = 60px
  }

  // Set how tall the event block should be (1 min = 1 pixel)
  getEventHeight(duration: number): number {
    return duration;
  }
}
