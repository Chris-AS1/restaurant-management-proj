import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { bartenderGuard } from './bartender.guard';

describe('bartenderGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => bartenderGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
