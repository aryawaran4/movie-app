import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

//components
import { LandingPageComponent } from './landing-page.component';

//module
import { SharedModule } from '../shared/shared.module';
import { LottieModule } from 'ngx-lottie';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
];

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    LottieModule
  ]
})
export class LandingPageModule { }
