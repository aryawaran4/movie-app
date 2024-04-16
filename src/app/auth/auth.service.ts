import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(email: string, password: string): boolean {
    // Retrieve the stored user data from local storage
    const storedUser = localStorage.getItem('user');
    
    // Check if there is any stored user data
    if (storedUser) {
      // Parse the stored user data from JSON format
      const user = JSON.parse(storedUser);
      
      // Check if the provided email and password match the stored user data
      if (email === user.email && password === user.password) {
        // If login is successful, set a token in local storage to indicate the user is logged in
        localStorage.setItem('token', 'dummyToken');
        return true;
      }
    }
    
    // If login fails due to invalid credentials or no stored user data, return false
    console.error('Login failed: Invalid credentials');
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  register(email: string, password: string): boolean {
    // Mocking registration for demonstration
    // In a real application, you would handle registration with a server-side endpoint
    if (email && password) {
      // Store the user information in local storage upon successful registration
      localStorage.setItem('user', JSON.stringify({ email, password }));
      return true; // Registration successful
    } else {
      // Simulating error handling for invalid registration data
      console.error('Registration failed: Invalid data');
      return false;
    }
  }
}
