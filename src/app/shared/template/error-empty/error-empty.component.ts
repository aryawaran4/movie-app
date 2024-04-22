import { Component, Input } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-error-empty',
  templateUrl: './error-empty.component.html',
  styleUrls: ['./error-empty.component.scss']
})
export class ErrorEmptyComponent {
  @Input() messageType: string | undefined;

  getTitleAndDescription(): { title: string, description: string } {
    let title = '';
    let description = '';
    switch (this.messageType) {
      case 'error':
        description = "We're sorry, but it seems there was an error. Please try again later.";
        break;
      case 'empty':
        description = "There is no content to display.";
        break;
      default:
        description = "Please provide a valid message type.";
    }
    return { title, description };
  }
}
