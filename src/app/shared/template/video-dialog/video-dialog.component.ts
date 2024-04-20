// video-dialog.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-dialog',
  template: `
    <div class="video-dialog">      
      <iframe width="560" height="315" [src]="'https://www.youtube.com/watch?v=' + videoId" frameborder="0" allowfullscreen></iframe>
      <button (click)="closeDialog()">Close</button>
    </div>
  `,
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent {
  @Input() videoId: string = '';

  constructor() { }

  closeDialog(): void {
    // You can emit an event or call a service method to close the dialog
  }
}
