import { Component, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoDialogService } from './video-dialog.service';

@Component({
  selector: 'app-video-dialog',
  template: `
    <div *ngIf="isOpen" class="video-dialog-overlay" (click)="closeDialog()">
      <div class="video-dialog">
        <div class="video-container">
          <iframe width="560" height="315" [src]="url" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="close-icon" (click)="closeDialog()">
          <span class="material-symbols-outlined">close</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnDestroy {
  @Input() set videoId(id: string) {
    this.setupVideoUrl(id);
  }
  url!: SafeResourceUrl;
  isOpen: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    private videoDialogService: VideoDialogService
  ) {
    document.body.classList.add('dialog-open');
  }

  ngOnDestroy() {
    document.body.classList.remove('dialog-open');
  }

  setupVideoUrl(videoId: string): void {
    // Create the YouTube embed URL using the videoId
    const videoUrl = 'https://www.youtube.com/embed/' + videoId;
    // Sanitize the URL to make it safe to use in an iframe
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  closeDialog(): void {
    this.videoDialogService.closeVideoDialog()
  }
}
