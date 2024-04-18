import { Injectable } from '@angular/core';
import { UserType } from 'src/app/shared/types/auth.type';
import { UserFavouriteType } from '../types/movie.type';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getMe(): UserType {
    const userString = localStorage.getItem('user') || '{}';
    return JSON.parse(userString) as UserType;
  }
  
  getUsersData(): UserFavouriteType[] {
    const usersData = localStorage.getItem('usersData') || '{}';
    return JSON.parse(usersData) as UserFavouriteType[];
  }
}
