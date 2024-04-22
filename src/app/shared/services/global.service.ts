import { Injectable } from '@angular/core';
import { UserType } from 'src/app/shared/types/auth.type';
import { UserFavouriteType } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private isOpen: boolean = false;

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getMe(): UserType {
    let userString = localStorage.getItem('user') || '{}';
    if (userString === '{}') {
      const defaultUserData = [{
        email: 'dummy@gmail.com',
        username: 'dummy',
        password: '123456',
        uuid: 'dummy',
        createdAt: '2024-04-22T03:01:17.767',
      }];// Set users data to empty array string if not found
      localStorage.setItem('user', JSON.stringify(defaultUserData));
      userString = JSON.stringify(defaultUserData);
    }
    return JSON.parse(userString) as UserType;
  }

  getUsersData(): UserFavouriteType {
    const uuid = this.getMe().uuid
    let usersData = localStorage.getItem('usersData') || '{}';
    if (usersData === '{}') {
      const defaultUserData = [{
        username: 'dummy',
        email: 'dummy@gmail.com',
        uuid: 'dummy',
        favourites: {
          movies: [],
          tv: []
        }
      }];// Set users data to empty array string if not found
      localStorage.setItem('usersData', JSON.stringify(defaultUserData));
      usersData = JSON.stringify(defaultUserData);
    }
    return JSON.parse(usersData).find((user: { uuid: string; }) => user.uuid === uuid)
  }
}
