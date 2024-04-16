import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  login(email: string, password: string): void {
    if (this.authService.login(email, password)) {
      console.log('Login successful');
      // Redirect or perform actions after successful login
    } else {
      console.error('Login failed');
      // Handle login failure
    }
  }

  logout(): void {
    this.authService.logout();
    // Perform any additional logout-related tasks, such as navigating to the login page
  }
}
