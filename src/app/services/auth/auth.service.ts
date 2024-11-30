import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = localStorage.getItem('access_token');
  private refreshToken: string | null = localStorage.getItem('refresh_token');
  private isRefreshing = false;
  private refreshTokenSubject: Subject<string> = new Subject<string>();
  private readonly baseUrl = environment.baseUrl;

  constructor(private httpService: HttpClient, private routerService: Router) {}

  getAccessToken(): string | null {
    return this.accessToken;
  }

  initOAuthFlow() {
    window.open('/auth/pipedrive', 'PipedriveAuth', 'width=600,height=700');
    window.addEventListener('message', this.messageListener);
  }

  messageListener = (event: MessageEvent<any>) => {
    if (event.origin !== window.location.origin) {
      return;
    }

    const { accessToken, refreshToken } = event.data;

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.routerService.navigate(['/'], { onSameUrlNavigation: 'reload' });

      window.removeEventListener('message', this.messageListener);
    }

    // TODO: handle window closed without authorized event;
  };

  refreshAccessToken(): Observable<string> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable();
    }

    this.isRefreshing = true;

    return new Observable<string>((observer) => {
      this.httpService
        .post(`${this.baseUrl}/auth/refresh`, {
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
        })
        .pipe(
          tap((response: any) => {
            this.accessToken = response.access_token;
            this.refreshToken = response.refresh_token;

            localStorage.setItem('access_token', this.accessToken!);
            localStorage.setItem('refresh_token', this.refreshToken!);

            this.refreshTokenSubject.next(this.accessToken!);
          }),
          catchError((error) => {
            this.refreshTokenSubject.error(error);
            return throwError(() => error);
          }),
          tap(() => {
            this.isRefreshing = false;
          })
        )
        .subscribe({
          next: (accessToken) => {
            observer.next(accessToken);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
          complete: () => {
            this.refreshTokenSubject.complete();
            this.refreshTokenSubject = new Subject<string>();
          },
        });
    });
  }
}
