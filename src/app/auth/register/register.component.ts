import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  showNavbar = true;

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthService) { }

  register(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const { username, email, password } = formValue;

      // Check if email and password are not null or undefined
      if (password && email && username) {
        // Call the register function with valid credentials
        this.authService.register({ username, email, password }).subscribe(
          (loggedIn: boolean) => {
            if (loggedIn) {
              console.log('register successful');
              // Redirect or perform actions after successful register
            } else {
              console.error('register failed');
              // Handle register failure
            }
          },
          error => {
            console.error('An error occurred during register:', error);
            // Handle register error
          }
        );
      } else {
        console.error('Invalid email or password');
        // Handle invalid email or password
      }
    } else {
      console.error('Invalid form data');
      // Handle invalid form data
    }
  }
}
