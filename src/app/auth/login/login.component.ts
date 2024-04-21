import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// services
import { AuthService } from '../../shared/services/auth/auth.service';
import { SnackbarService } from 'src/app/shared/template/snackbar/snackbar.service';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  showNavbar = true;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) { }

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.snackbar.showLoading(true);
      this.authService.login({ email, password }).subscribe(
        (loggedIn: boolean) => {
          this.snackbar.showLoading(false);
          if (loggedIn) {
            this.router.navigateByUrl('/dashboard');
            this.snackbar.show('Login successful');
          } else {
            this.snackbar.show('Invalid email or password');
          }
        },
        error => {
          this.snackbar.showLoading(false);
          this.snackbar.show('An error occurred during login');
          console.error('An error occurred during login:', error);
        }
      );
    } else {
      // Form is invalid, do nothing as the error messages will be displayed in the HTML
    }
  }

  logout(): void {
    this.authService.logout();
    // Additional logout-related tasks
  }
}
