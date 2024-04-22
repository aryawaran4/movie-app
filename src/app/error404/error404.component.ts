import { Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.scss']
})
export class Error404Component {

  showNavbar = true;

  animationOptions: AnimationOptions = {
    path: '/assets/animations/not_found_404.json',
    autoplay: true,
    loop: true
  };

  constructor() { }

}
