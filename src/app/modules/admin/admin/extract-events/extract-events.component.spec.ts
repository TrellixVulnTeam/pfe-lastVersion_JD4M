import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractEventsComponent } from './extract-events.component';

describe('ExtractEventsComponent', () => {
  let component: ExtractEventsComponent;
  let fixture: ComponentFixture<ExtractEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtractEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtractEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
