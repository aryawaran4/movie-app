// snackbar.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackbarElement: HTMLElement;

  constructor() {
    this.snackbarElement = document.createElement('div');
    this.snackbarElement.className = 'snackbar';
    document.body.appendChild(this.snackbarElement);
  }

  show(message: string, duration: number = 4000): void {
    this.snackbarElement.textContent = message;
    this.snackbarElement.classList.add('show');
    setTimeout(() => {
      this.snackbarElement.classList.remove('show');
    }, duration);
  }
}