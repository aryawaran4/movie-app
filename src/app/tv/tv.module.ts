import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { TvComponent } from './tv.component';
import { TvDetailsComponent } from './details/details.component';

const routes: Routes = [
  {
    path: '',
    component: TvComponent,
  },
  {
    path: ':id',
    component: TvDetailsComponent,
  }
];

@NgModule({
  declarations: [TvComponent, TvDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TvModule { }
