import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserType } from './auth.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(authData: Partial<UserType>) {
    // Retrieve the stored user data from local storage
    const storedUser = localStorage.getItem('user');

    // Check if there is any stored user data
    if (storedUser) {
      // Parse the stored user data from JSON format
      const user = JSON.parse(storedUser);

      // Check if the provided email and password match the stored user data
      if (authData.email === user.email && authData.password === user.password) {
        // If login is successful, set a token in local storage to indicate the user is logged in
        localStorage.setItem('token', 'dummyToken');
        return of(true); // Return an observable with true value for successful login
      }
    }

    // If login fails due to invalid credentials or no stored user data, return false
    console.error('Login failed: Invalid credentials');
    return of(false); // Return an observable with false value for failed login
  }

  register(authData: UserType) {
    // Mocking registration for demonstration
    // In a real application, you would handle registration with a server-side endpoint
    if (authData.email && authData.username && authData.password) {
      // Store the user information in local storage upon successful registration
      localStorage.setItem('user', JSON.stringify({ email: authData.email, username: authData.username, password: authData.password }));
      return of(true); // Return an observable with true value for successful registration
    } else {
      // Simulating error handling for invalid registration data
      console.error('Registration failed: Invalid data');
      return of(false); // Return an observable with false value for failed registration
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
