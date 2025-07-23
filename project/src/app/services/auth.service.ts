// This tells Angular we are creating a service that can be used anywhere in the app
import { Injectable } from '@angular/core';

// These help us manage and observe user data over time
import { BehaviorSubject, Observable } from 'rxjs';

// This is a blueprint of a User with different roles and optional details
export interface User {
  id: string; // Unique ID for the user
  email: string; // User's email
  name: string; // User's name
  role: 'student' | 'teacher' | 'administrator' | 'alumni'; // User's role (fixed options)
  profileImage?: string; // Optional profile picture
  department?: string; // Optional department (for example, CSE, ECE)
  graduationYear?: number; // Optional year of graduation
}

// This makes the service available app-wide automatically
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // This holds the current user and can change over time
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  // This lets other parts of the app "watch" for changes in the user
  public currentUser$ = this.currentUserSubject.asObservable();

  // Constructor runs as soon as the service is created
  constructor() {
    // Check if a user is already saved in the browser (like after refresh)
    const savedUser = localStorage.getItem('currentUser');

    // If there is a saved user, load it into the app
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser)); // Convert saved text into a real object
    }
  }

  // This function is called when a user wants to log in
  login(email: string, password: string): Observable<boolean> {
    // We return an observable so other parts of the app can wait for login to finish
    return new Observable(observer => {
      // Wait 1 second to simulate a real API call
      setTimeout(() => {
        // If both email and password are provided
        if (email && password) {
          // Create a fake user object
          const user: User = {
            id: '1',
            email: email,
            name: email.split('@')[0], // Get name from email
            role: 'teacher' // For now, we just say the role is teacher
          };

          // Save user in browser so they stay logged in
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Let the app know who the current user is
          this.currentUserSubject.next(user);

          // Tell the observer: login was successful
          observer.next(true);
        } else {
          // If login details were not good, tell observer it failed
          observer.next(false);
        }

        // Complete the observable
        observer.complete();
      }, 1000); // 1 second delay
    });
  }

  // This function is used to register a new user
  register(
    email: string,
    password: string,
    name: string,
    role: User['role'],
    department?: string,
    graduationYear?: number
  ): Observable<boolean> {
    return new Observable(observer => {
      // Simulate a 1-second API call
      setTimeout(() => {
        // Check if required fields are provided
        if (email && password && name && role) {
          // Create a new user object
          const user: User = {
            id: Date.now().toString(), // Create a unique ID using current time
            email: email,
            name: name,
            role: role,
            profileImage: this.getDefaultProfileImage(role), // Get profile picture for role
            department: department, // Optional
            graduationYear: graduationYear // Optional
          };

          // Save the user in browser storage
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Set the current user in our app
          this.currentUserSubject.next(user);

          // Registration successful
          observer.next(true);
        } else {
          // Registration failed due to missing data
          observer.next(false);
        }

        // Finish the observable
        observer.complete();
      }, 1000);
    });
  }

  // This function logs out the user
  logout(): void {
    // Remove the user from browser storage
    localStorage.removeItem('currentUser');

    // Clear the user from the app
    this.currentUserSubject.next(null);
  }

  // This is a getter to get the current user directly
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // This function is used to manually set a demo user (used for testing)
  setDemoUser(user: User): void {
    // Set the demo user in app
    this.currentUserSubject.next(user);

    // Save the demo user in browser
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // This returns true if someone is logged in
  get isAuthenticated(): boolean {
    return !!this.currentUserValue; // Double exclamation makes sure it's true or false
  }

  // This function gives a default image URL based on role
  private getDefaultProfileImage(role: User['role']): string {
    const images = {
      student: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
      teacher: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?w=100&h=100&fit=crop&crop=face',
      administrator: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop&crop=face',
      alumni: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face'
    };

    // Return the image that matches the role
    return images[role];
  }
}
