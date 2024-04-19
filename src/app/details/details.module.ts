import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie/movie.component';
import { TvComponent } from './tv/tv.component';
import { Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{
  path: 'movie/:id',
  component: MovieComponent
},
{
  path: 'report-details/:id',
  component: TvComponent
}
];

@NgModule({
  declarations: [
    MovieComponent,
    TvComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DetailsModule { }
