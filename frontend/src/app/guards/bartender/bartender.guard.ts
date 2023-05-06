import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Roles } from 'src/app/models/user.roles.model';

export const bartenderGuard: CanActivateFn = (route, state) => {
  const Auth = inject(AuthService)

  return Auth.currentRole === Roles.BARTENDER
};
