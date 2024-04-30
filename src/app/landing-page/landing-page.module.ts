import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//components
import { LandingPageComponent } from './landing-page.component';

//module
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class LandingPageModule { }
