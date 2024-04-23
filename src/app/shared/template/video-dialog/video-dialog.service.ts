import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { VideoDialogComponent } from './video-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class VideoDialogService {
  private dialogComponentRef: ComponentRef<VideoDialogComponent> | null = null;
  private isOpen: boolean = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  openVideoDialog(videoId: string): void {    
    if (!this.isOpen) {
      const dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoDialogComponent);
      const componentRef = dialogComponentFactory.create(this.injector);
      componentRef.instance.videoId = videoId;

      this.appRef.attachView(componentRef.hostView);

      const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      document.body.appendChild(domElem);

      this.dialogComponentRef = componentRef;
      this.isOpen = true;
    } else if (this.dialogComponentRef) {
      // If dialog is already open and dialogComponentRef is not null, update the video ID
      this.dialogComponentRef.instance.videoId = videoId;
    }
  }


  closeVideoDialog(): void {
    if (this.isOpen && this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
      this.isOpen = false;
    }
  }

  isVideoDialogOpen(): boolean {
    return this.isOpen;
  }
}
