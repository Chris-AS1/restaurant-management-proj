import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTableSeatsComponent } from './book-table-seats.component';

describe('BookTableSeatsComponent', () => {
  let component: BookTableSeatsComponent;
  let fixture: ComponentFixture<BookTableSeatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookTableSeatsComponent]
    });
    fixture = TestBed.createComponent(BookTableSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
