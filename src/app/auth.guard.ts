import { CanActivateFn } from '@angular/router';
import { environment } from '../environments/environment';

const baseUrl = environment.baseUrl;

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.location.href = `${baseUrl}/auth/pipedrive`;

    return false;
  }
  return true;
};
