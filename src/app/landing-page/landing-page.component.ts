import { Component } from '@angular/core';
import { Router } from '@angular/router';

// plugin
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  showNavbar = true;

  constructor(private router: Router) { }

  navigateTo(url: string): void {
    this.router.navigateByUrl(url);
  }  

  animationOptions: AnimationOptions = {
    path: '/assets/animations/loading.json',
    autoplay: true,
    loop: true
  };
}
