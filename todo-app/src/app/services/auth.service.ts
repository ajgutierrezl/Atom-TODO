import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token.storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = this.tokenStorage.getToken();
    if (token) {
      this.validateToken().subscribe({
        error: () => {
          this.logout();
        }
      });
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getToken() && !!this.getCurrentUser();
  }

  login(email: string): Observable<User> {
    return this.http.post<{user: User, token: string}>(`${this.apiUrl}/login`, { email })
      .pipe(
        tap(response => {
          this.tokenStorage.setToken(response.token);
          this.currentUserSubject.next(response.user);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => new Error('Error during login'));
        })
      );
  }

  register(email: string): Observable<User> {
    return this.http.post<{user: User, token: string}>(`${this.apiUrl}/register`, { email })
      .pipe(
        tap(response => {
          this.tokenStorage.setToken(response.token);
          this.currentUserSubject.next(response.user);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => new Error('Error during registration'));
        })
      );
  }

  logout(): void {
    this.tokenStorage.removeToken();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  private validateToken(): Observable<User> {
    const token = this.tokenStorage.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Token validation error:', error);
          this.logout();
          return throwError(() => new Error('Invalid token'));
        })
      );
  }

  refreshToken(): Observable<string> {
    const token = this.tokenStorage.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    return this.http.post<{token: string}>(`${this.apiUrl}/refresh-token`, {})
      .pipe(
        tap(response => {
          this.tokenStorage.setToken(response.token);
        }),
        map(response => response.token),
        catchError(error => {
          console.error('Token refresh error:', error);
          this.logout();
          return throwError(() => new Error('Error refreshing token'));
        })
      );
  }
} 