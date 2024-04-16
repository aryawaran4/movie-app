import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
}
