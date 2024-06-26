import { Injectable } from '@angular/core';
import { UserType } from 'src/app/shared/types/auth.type';
import { UserFavouriteType } from '../types/movie.type';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private isOpen: boolean = false; // Flag to track if a global service instance is open

  constructor() {}

  /**
   * Retrieves the authentication token from local storage.
   * @returns The authentication token if available, otherwise null.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Retrieves user information from local storage.
   * @returns The user information.
   */
  getMe(): UserType {
    let userString = localStorage.getItem('user') || '{}';
    if (userString === '{}') {
      const defaultUserData = [
        {
          email: 'dummy@gmail.com',
          username: 'dummy',
          password: '123456',
          uuid: 'dummy',
          createdAt: '2024-04-22T03:01:17.767',
        },
      ];
      // Set default user data if not found
      localStorage.setItem('user', JSON.stringify(defaultUserData));
      userString = JSON.stringify(defaultUserData);
    }
    return JSON.parse(userString) as UserType;
  }

  /**
   * Retrieves all user data from local storage or sets default data if not found.
   * The purpose of this service is to find the user and select the data they have so it can be used.
   * @returns The user's data.
   */
  getUsersData(): UserFavouriteType {
    const uuid = this.getMe().uuid; // Get UUID of the current user
    let usersData = localStorage.getItem('usersData') || '{}';
    if (usersData === '{}') {
      const defaultUserData = [
        {
          username: 'dummy',
          email: 'dummy@gmail.com',
          uuid: 'dummy',
          favourites: {
            movies: [],
            tv: [],
          },
        },
      ];
      // Set default user's favorite data if not found
      localStorage.setItem('usersData', JSON.stringify(defaultUserData));
      usersData = JSON.stringify(defaultUserData);
    }
    // Find and return user's favorite data by UUID
    return JSON.parse(usersData).find(
      (user: { uuid: string }) => user.uuid === uuid
    );
  }
}
