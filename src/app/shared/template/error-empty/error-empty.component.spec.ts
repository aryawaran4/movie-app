import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorEmptyComponent } from './error-empty.component';

describe('ErrorEmptyComponent', () => {
  let component: ErrorEmptyComponent;
  let fixture: ComponentFixture<ErrorEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorEmptyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
