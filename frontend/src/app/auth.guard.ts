import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const Auth = inject(AuthService)
  console.log("Guard - isLoggedIn???", Auth.isLoggedIn)

  return Auth.isLoggedIn;
};

