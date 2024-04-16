import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private authService: AuthService) { }

  register(email: string, password: string): void {
    if (this.authService.register(email, password)) {
      console.log('Registration successful');
      // Redirect or perform actions after successful registration
    } else {
      console.error('Registration failed');
      // Handle registration failure
    }
  }
}
