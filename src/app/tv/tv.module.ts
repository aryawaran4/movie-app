import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TvComponent } from './tv.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [TvComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ]
})
export class TvModule { }
