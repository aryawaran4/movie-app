import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  showNavbar = true;

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      const { email, password } = formValue;

      // Check if email and password are not null or undefined
      if (email && password) {
        // Call the login function with valid credentials
        this.authService.login({ email, password }).subscribe(
          (loggedIn: boolean) => {
            if (loggedIn) {
              console.log('Login successful');
              // Redirect or perform actions after successful login
            } else {
              console.error('Login failed');
              // Handle login failure
            }
          },
          error => {
            console.error('An error occurred during login:', error);
            // Handle login error
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


  logout(): void {
    this.authService.logout();
    // Perform any additional logout-related tasks, such as navigating to the login page
  }
}
