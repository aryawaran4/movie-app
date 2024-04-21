import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: MoviesComponent,
  },
  {
    path: ':id',
    component: MovieDetailsComponent,
  }
];

@NgModule({
  declarations: [MoviesComponent, MovieDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes) // Use forChild for lazy loading
  ]
})
export class MoviesModule { }
