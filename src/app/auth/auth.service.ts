import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserType } from './auth.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(authData: Partial<UserType>): Observable<boolean> {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Stored Users:', storedUsers); // Log the stored users array to see its contents

    const user = storedUsers.find((u: UserType) => u.email === authData.email && u.password === authData.password);
    console.log('User found:', user); // Log the user object found

    if (user) {
      localStorage.setItem('token', 'dummyToken');
      return of(true);
    } else {
      console.error('Login failed: Invalid credentials');
      return of(false);
    }
  }


  register(authData: Partial<UserType>): Observable<boolean> {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the email already exists
    const emailExists = storedUsers.some((u: UserType) => u.email === authData.email);
    if (emailExists) {
      console.error('Registration failed: Email already exists');
      return of(false);
    }

    // Register the user if the email is unique
    if (authData.email && authData.username && authData.password) {
      const uuid = uuidv4();
      storedUsers.push({ email: authData.email, username: authData.username, password: authData.password, uuid });
      localStorage.setItem('users', JSON.stringify(storedUsers));
      console.log('Stored Users after registration:', storedUsers); // Log the stored users array after registration
      return of(true);
    } else {
      console.error('Registration failed: Invalid data');
      return of(false);
    }
  }


  logout(): void {
    localStorage.removeItem('token');
  }
}
