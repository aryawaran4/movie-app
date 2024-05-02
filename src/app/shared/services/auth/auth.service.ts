import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// type
import { UserType } from '../../types/auth.type';
import { UserFavouriteType } from '../../types/movie.type';
import { SnackbarService } from '../../template/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private snackbar: SnackbarService) {}

  /**
   * Checks if the user is logged in by verifying the presence of a token in the local storage.
   * @returns A boolean indicating whether the user is logged in.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Handles user login by comparing provided authentication data with stored user credentials.
   * @param authData Partial user data containing email and password for authentication.
   * @returns An Observable<boolean> indicating whether the login attempt was successful.
   */
  login(authData: Partial<UserType>): Observable<boolean> {
    // Parse the local storage data of users or provides a default value of []
    const storedUsers = JSON.parse(
      localStorage.getItem('users') || '[]'
    ) as UserType[];

    let foundUser: UserType | undefined; // Define a variable to store the found user

    // Iterate over storedUsers array to find the matching user
    storedUsers.forEach((u: UserType) => {
      if (u.email === authData.email && u.password === authData.password) {
        foundUser = u; // Store the found user
      }
    });

    if (foundUser) {
      // If user is found, set a dummy token and store user data in local storage
      localStorage.setItem('token', 'dummyToken');
      localStorage.setItem('user', JSON.stringify(foundUser));
      // Pass the found user data to createUsersData function
      this.createUsersData(foundUser);
      return of(true); // Return an observable of true indicating successful login
    } else {
      return of(false); // Return an observable of false indicating unsuccessful login
    }
  }

  /**
   * Handles user registration by checking if the provided email is unique and then registering the user.
   * @param authData Partial user data containing email, username, and password for registration.
   * @returns An Observable<boolean> indicating whether the registration attempt was successful.
   */
  register(authData: Partial<UserType>): Observable<boolean> {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the email already exists
    const emailExists = storedUsers.some(
      (u: UserType) => u.email === authData.email
    );
    if (emailExists) {
      console.error('Registration failed: Email already exists');
      this.snackbar.show('Registration failed: Email already exists');
      return of(false);
    }

    // Register the user if the email is unique
    if (authData.email && authData.username && authData.password) {
      const uuid = uuidv4();
      const createdAt = new Date();
      storedUsers.push({
        email: authData.email,
        username: authData.username,
        password: authData.password,
        uuid,
        createdAt,
      });
      localStorage.setItem('users', JSON.stringify(storedUsers));
      return of(true); // Return an observable of true indicating successful registration
    } else {
      console.error('Registration failed: Invalid data');
      this.snackbar.show('Registration failed: Invalid data');
      return of(false); // Return an observable of false indicating unsuccessful registration
    }
  }

  /**
   * Creates user data for favorites based on provided user data.
   * @param userData Partial user data containing username, email, and UUID.
   */
  createUsersData(userData: Partial<UserType>): void {
    let usersData: UserFavouriteType[] = JSON.parse(
      localStorage.getItem('usersData') || '[]'
    );

    if (userData.uuid) {
      const existingUser = usersData.find(
        (user) => user.uuid === userData.uuid
      );

      if (!existingUser) {
        const newUserEntry = {
          username: userData.username || '',
          email: userData.email || '',
          uuid: userData.uuid || '',
          favourites: {
            movies: [],
            tv: [],
          }, // Initialize favourites as an empty array
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

  /**
   * Handles user logout by removing the token and user data from local storage.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
