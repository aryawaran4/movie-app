import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private snackbarElement: HTMLElement;

  constructor() {
    this.snackbarElement = document.createElement('div');
    this.snackbarElement.className = 'snackbar';
    document.body.appendChild(this.snackbarElement);
  }

  show(message: string, loading?: boolean): void {
    const duration: number = 1000;
    this.snackbarElement.textContent = message;
    this.snackbarElement.classList.add('show');

    setTimeout(() => {
      this.snackbarElement.classList.remove('show');
    }, duration);

  }

  showLoading(loading: boolean): void {
    const duration: number = 1000;
    if (loading) {
      this.snackbarElement.textContent = 'loading...';
      this.snackbarElement.classList.add('show');
    } else {
      setTimeout(() => {
        this.snackbarElement.classList.remove('show');
      }, duration);
    }
  }
}
