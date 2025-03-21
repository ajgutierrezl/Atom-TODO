import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token.storage.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // No interceptar las rutas de autenticación
    if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
      return next.handle(request);
    }

    const token = this.tokenStorage.getToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !request.url.includes('/auth/refresh-token')) {
          return this.handle401Error(request, next);
        }

        if (error.status === 403) {
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap(token => {
          this.isRefreshing = false;
          return next.handle(this.addToken(request, token));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    }

    return next.handle(request);
  }
} 