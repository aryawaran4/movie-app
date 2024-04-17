import { Injectable } from '@angular/core';
import { UserType } from 'src/app/auth/auth.type';

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
  
  
}
