import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderarrayComponent } from './orderarray.component';

describe('OrderarrayComponent', () => {
  let component: OrderarrayComponent;
  let fixture: ComponentFixture<OrderarrayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderarrayComponent]
    });
    fixture = TestBed.createComponent(OrderarrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
