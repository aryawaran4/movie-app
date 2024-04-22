import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LottieModule } from 'ngx-lottie';
import { RouterModule } from '@angular/router';
import { Error404Component } from './error404.component';



@NgModule({
  declarations: [Error404Component],
  imports: [
    CommonModule,
    SharedModule,
    LottieModule,
    RouterModule
  ]
})
export class Error404Module { }
