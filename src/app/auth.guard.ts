import { CanActivateFn, Router } from '@angular/router';
import { decodeToken } from './helpers/decode-token';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  if (token) {
    const decodedToken = decodeToken(token);
    const expiryDate = new Date(decodedToken.exp * 1000);

    if (expiryDate > new Date()) {
      return true;
    }
  }
  router.navigate(['/login']);
  return false;
};
