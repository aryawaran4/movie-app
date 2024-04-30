import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// type
import { UserType } from '../../types/auth.type';
import { UserFavouriteType } from '../../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to handle user login
  login(authData: Partial<UserType>): Observable<boolean> {
    // Parse the local storage data of users or provides a default value of []
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as UserType[];

    let foundUser: UserType | undefined; // Define a variable to store the found user

    // Iterate over storedUsers array to find the matching user
    storedUsers.forEach((u: UserType) => {
      if (u.email === authData.email && u.password === authData.password) {
        foundUser = u; // Store the found user
      }
    });

    if (foundUser) {
      localStorage.setItem('token', 'dummyToken');
      localStorage.setItem('user', JSON.stringify(foundUser));
      this.createUsersData(foundUser); // Pass the found user data to createUsersData function
      return of(true);
    } else {
      return of(false);
    }
  }

  // Method to handle user registration
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
      const createdAt = new Date()
      storedUsers.push({ email: authData.email, username: authData.username, password: authData.password, uuid, createdAt });
      localStorage.setItem('users', JSON.stringify(storedUsers));
      return of(true);
    } else {
      console.error('Registration failed: Invalid data');
      return of(false);
    }
  }

  // Method to create user data for favorites
  createUsersData(userData: Partial<UserType>): void {
    let usersData: UserFavouriteType[] = JSON.parse(localStorage.getItem('usersData') || '[]');

    if (userData.uuid) {
      const existingUser = usersData.find(user => user.uuid === userData.uuid);

      if (!existingUser) {
        const newUserEntry = {
          username: userData.username || '',
          email: userData.email || '',
          uuid: userData.uuid || '',
          favourites: {
            movies: [],
            tv: []
          } // Initialize favourite as an empty array
        };
        usersData.push(newUserEntry);
        localStorage.setItem('usersData', JSON.stringify(usersData));
      } else {
        console.log('User with the provided UUID already exists in usersData');
      }
    } else {
      console.error('Invalid userData: UUID is missing');
    }
  }

  // Method to handle user logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
