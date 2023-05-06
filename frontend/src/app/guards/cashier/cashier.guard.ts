import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Roles } from 'src/app/models/user.roles.model';
import { AuthService } from 'src/app/auth.service';

export const cashierGuard: CanActivateFn = (route, state) => {
  const Auth = inject(AuthService)

  return Auth.currentRole === Roles.CASHIER
};
