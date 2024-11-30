import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = 'http://localhost:4000/auth/pipedrive';

    return false;
  }
  return true;
};
