import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesComponent } from './movies.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailsComponent } from './details/details.component';
import { MinutesToHoursMinutesPipe } from '../shared/pipe/minutes-to-hours-minutes.pipe';

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
  declarations: [MoviesComponent, MovieDetailsComponent, MinutesToHoursMinutesPipe],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MoviesModule { }
