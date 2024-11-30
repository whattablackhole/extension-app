import { CanActivateFn } from '@angular/router';
import { environment } from '../environments/environment';

const baseUrl = environment.baseUrl;


const messageListener = (event: MessageEvent<any>) => {
  if (event.origin !== window.location.origin) {
    return;
  }

  const { accessToken, refreshToken } = event.data;

  if (accessToken && refreshToken) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    window.location.href = `${baseUrl}/`;

    window.removeEventListener('message', messageListener);
  }
};

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    window.open(
      '/auth/pipedrive',
      'PipedriveAuth',
      'width=600,height=700'
    );
    window.addEventListener('message', messageListener);
    return false;
  }
  return true;
};

