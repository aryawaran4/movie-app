import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/template/snackbar/snackbar.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService) { }

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
              this.snackbar.show('register successful');
              this.router.navigateByUrl('/login');
            } else {
              console.error('register failed');
              // Handle register failure
              this.snackbar.show('register failed');
            }
          },
          error => {
            console.error('An error occurred during register:', error);
            // Handle register error
            this.snackbar.show('An error occurred during register:');
          }
        );
      } else {
        console.error('Invalid email or password');
        // Handle invalid email or password
        this.snackbar.show('Invalid email or password');
      }
    } else {
      console.error('Invalid form data');
      // Handle invalid form data
      this.snackbar.show('Invalid form data');
    }
  }
}
