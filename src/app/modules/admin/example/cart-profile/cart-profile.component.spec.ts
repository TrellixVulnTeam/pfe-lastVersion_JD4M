import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProfileComponent } from './cart-profile.component';

describe('CartProfileComponent', () => {
  let component: CartProfileComponent;
  let fixture: ComponentFixture<CartProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
