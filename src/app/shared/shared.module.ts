import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './template/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { VideoDialogComponent } from './template/video-dialog/video-dialog.component';



@NgModule({
  declarations: [
    NavbarComponent,
    VideoDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [NavbarComponent]
})
export class SharedModule { }
