import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cookGuard } from './cook.guard';

describe('cookGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cookGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
