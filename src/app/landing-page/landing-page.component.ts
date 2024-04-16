import { Component } from '@angular/core';

// plugin
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  showNavbar = true;

  animationOptions: AnimationOptions = {
    path: '/assets/animations/loading.json',
    autoplay: true,
    loop: true
  };
}
