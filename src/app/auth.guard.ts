import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (!token && !refreshToken) {
    const authService = inject(AuthService);
    authService.initOAuthFlow();
    return false;
  }
  return true;
};
