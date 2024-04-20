import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../shared/services/auth/auth.service';
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
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: SnackbarService
  ) { }

  register(): void {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register({ username, email, password }).subscribe(
        (loggedIn: boolean) => {
          if (loggedIn) {
            this.router.navigateByUrl('/login');
            this.snackbar.show('Registration successful');
          } else {
            this.snackbar.show('Registration failed');
          }
        },
        error => {
          console.error('An error occurred during registration:', error);
          this.snackbar.show('An error occurred during registration');
        }
      );
    } else {
      // Form is invalid, do nothing as the error messages will be displayed in the HTML
    }
  }
}
