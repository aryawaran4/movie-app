import { TestBed } from '@angular/core/testing';

import { VideoDialogService } from './video-dialog.service';

describe('VideoDialogService', () => {
  let service: VideoDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
