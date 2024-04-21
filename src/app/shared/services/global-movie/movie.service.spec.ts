import { TestBed } from '@angular/core/testing';

import { GlobalMovieService } from './movie.service';

describe('GlobalMovieService', () => {
  let service: GlobalMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
