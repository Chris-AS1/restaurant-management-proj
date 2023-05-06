import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { waiterGuard } from './waiter.guard';

describe('waiterGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => waiterGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
