import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { 
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(email: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/login`, { email })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          return throwError(() => new Error('User not found'));
        })
      );
  }

  register(email: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, { email })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          return throwError(() => new Error('Error registering user'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 