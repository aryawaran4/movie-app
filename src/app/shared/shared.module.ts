import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './template/navbar/navbar.component';
import { VideoDialogComponent } from './template/video-dialog/video-dialog.component';
import { ErrorEmptyComponent } from './template/error-empty/error-empty.component';



@NgModule({
  declarations: [
    NavbarComponent,
    VideoDialogComponent,
    ErrorEmptyComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [NavbarComponent, VideoDialogComponent, ErrorEmptyComponent]
})
export class SharedModule { }
