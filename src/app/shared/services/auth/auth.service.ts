import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserType } from '../../types/auth.type';
import { v4 as uuidv4 } from 'uuid';
import { UserFavouriteType } from '../../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  login(authData: Partial<UserType>): Observable<boolean> {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as UserType[];
    console.log('Stored Users:', storedUsers); // Log the stored users array to see its contents

    let foundUser: UserType | undefined; // Define a variable to store the found user

    // Iterate over storedUsers array to find the matching user
    storedUsers.forEach((u: UserType) => {
      if (u.email === authData.email && u.password === authData.password) {
        foundUser = u; // Store the found user
      }
    });

    console.log('User found:', foundUser); // Log the found user object

    if (foundUser) {
      localStorage.setItem('token', 'dummyToken');
      localStorage.setItem('user', JSON.stringify(foundUser));
      this.createUsersData(foundUser); // Pass the found user data to createUsersData function
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

  createUsersData(userData: Partial<UserType>): void {
    // Retrieve existing usersData array from localStorage or initialize it if it doesn't exist
    let usersData: UserFavouriteType[] = JSON.parse(localStorage.getItem('usersData') || '[]');

    // Check if the provided userData has a valid uuid
    if (userData.uuid) {
      // Check if the provided uuid already exists in usersData
      const existingUser = usersData.find(user => user.uuid === userData.uuid);

      if (!existingUser) {
        // Create a new entry for userData
        const newUserEntry = {
          username: userData.username || '',
          email: userData.email || '',
          uuid: userData.uuid || '',
          favourites: [] // Initialize favourite as an empty array
        };

        // Push the new user entry to the usersData array
        usersData.push(newUserEntry);

        // Save the updated usersData array back to localStorage
        localStorage.setItem('usersData', JSON.stringify(usersData));
      } else {
        console.log('User with the provided UUID already exists in usersData');
      }
    } else {
      console.error('Invalid userData: UUID is missing');
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
