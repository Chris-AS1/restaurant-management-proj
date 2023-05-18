import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncookedComponent } from './uncooked.component';

describe('UncookedComponent', () => {
  let component: UncookedComponent;
  let fixture: ComponentFixture<UncookedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UncookedComponent]
    });
    fixture = TestBed.createComponent(UncookedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
