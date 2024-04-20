import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//components
import { LandingPageComponent } from './landing-page.component';

//module
import { SharedModule } from '../shared/shared.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    LottieModule,
    RouterModule
  ]
})
export class LandingPageModule { }
