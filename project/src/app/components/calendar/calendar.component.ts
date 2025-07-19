// Angular core and common module imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material UI modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

// Custom services and models
import { DataService } from '../../services/data.service';
import { Course } from '../../models/course.model';

// Interface for a calendar event
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  courseId: string;
  color: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting';
}

// Interface representing each day on the calendar
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
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
  // Controls the current view (month/week/day)
  currentView: 'month' | 'week' | 'day' = 'month';

  // Current date being viewed
  currentDate = new Date();

  // Selected course (for filtering)
  selectedCourse = '';

  // List of courses retrieved from the service
  courses: Course[] = [];

  // All calendar events (classes, meetings, etc.)
  events: CalendarEvent[] = [];

  // Array of weeks in the month view
  calendarWeeks: CalendarDay[][] = [];

  // Days of the current week (used in week/day view)
  currentWeekDays: any[] = [];

  // Upcoming events to show in the sidebar or summary
  upcomingEvents: CalendarEvent[] = [];

  // Days of the week for display
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Time slots for day/week view layout
  timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
  ];

  // Inject the data service
  constructor(private dataService: DataService) {}

  // Lifecycle hook: fetch data and initialize calendar
  ngOnInit() {
    this.dataService.getCourses().subscribe(courses => {
      this.courses = courses;
      this.generateSampleEvents();     // Add example events
      this.generateCalendar();         // Build calendar grid
      this.generateUpcomingEvents();   // Get next few events
    });
  }

  // Create example events manually (hardcoded)
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
        date: new Date(year, 7, 10), // 🎉 Adjust this to your actual birthday
        time: 'All Day',
        duration: 0,
        courseId: '',
        color: '#FF69B4',
        type: 'meeting' // or 'event'
      }
    ];
  }

  // Build the calendar grid based on the current date
  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Backtrack to Sunday

    this.calendarWeeks = [];
    let currentWeek: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) { // 6 weeks x 7 days
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

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

      if (currentWeek.length === 7) {
        this.calendarWeeks.push(currentWeek);
        currentWeek = [];
      }
    }
  }

  // Get next 5 upcoming events sorted by date
  generateUpcomingEvents() {
    const today = new Date();
    this.upcomingEvents = this.events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }

  // Format the header title depending on the view
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

  // Go to previous month/week/day
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

  // Go to next month/week/day
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

  // Find course title by ID
  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  }

  // Create human-friendly date string for an event
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

  // Calculate the top position of the event in the UI (based on time)
  getEventTop(time: string): number {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour;
    return (adjustedHour - 8) * 60; // Layout starts at 8 AM
  }

  // Set height of event block based on duration
  getEventHeight(duration: number): number {
    return duration; // 1 minute = 1px height
  }
}
