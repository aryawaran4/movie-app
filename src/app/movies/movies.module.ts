import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [MoviesComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class MoviesModule { }
