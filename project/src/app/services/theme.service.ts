// This tells Angular that this file provides a service that can be used in the whole app
import { Injectable } from '@angular/core';
// This is used to create a special variable that can be watched for changes
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // This means this service will be available everywhere in the app
})
export class ThemeService {
  // Create a private variable to store whether dark mode is on (true) or off (false)
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);

  // Make a public version of the variable that other parts of the app can watch
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Try to get the saved theme (dark or light) from the browser's local storage
    const savedTheme = localStorage.getItem('theme');

    // Check if the user's device prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Decide which theme to use:
    // If user saved one, use it; otherwise, use the device's preference
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    // Set the theme based on the result above
    this.setTheme(isDark);
  }

  // This function switches between light and dark themes
  toggleTheme(): void {
    // Get the current theme (true for dark, false for light)
    const currentTheme = this.isDarkModeSubject.value;

    // Change it to the opposite (toggle it)
    this.setTheme(!currentTheme);
  }

  // This function sets the theme to either dark or light
  setTheme(isDark: boolean): void {
    // Update the theme value and tell everyone who is watching it
    this.isDarkModeSubject.next(isDark);

    // Save the selected theme to the browser so it remembers it next time
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // If it's dark mode, add a class to the body element to apply dark styles
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      // If it's light mode, remove the dark class from the body
      document.body.classList.remove('dark-theme');
    }
  }

  // A helper function to get the current value of the theme (dark or not)
  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }
}
