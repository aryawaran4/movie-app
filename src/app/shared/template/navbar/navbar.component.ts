import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn = false

  constructor(private router: Router, private authService:AuthService) { }

  ngOnInit(){
    if (this.authService.isLoggedIn()) {
      this.isLoggedIn = true
    }
  }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  } 

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('login');
  }
}
