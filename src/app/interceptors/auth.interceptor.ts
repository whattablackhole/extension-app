import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.getAccessToken()}`,
                },
              });
              return next.handle(clonedRequest);
            }),
            catchError(() => {
              this.authService.initOAuthFlow();
              return EMPTY;
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
