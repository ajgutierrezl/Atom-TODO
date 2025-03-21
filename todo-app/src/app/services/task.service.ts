import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getTasks(): Observable<Task[]> {
    const userId = this.authService.getCurrentUser()?.id;
    return this.http.get<Task[]>(`${this.apiUrl}/tasks?userId=${userId}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Error getting tasks'));
        })
      );
  }

  createTask(taskData: {title: string, description: string, completed: boolean}): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, {
      ...taskData,
      createdAt: new Date(),
      userId: this.authService.getCurrentUser()?.id
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Error creating task'));
      })
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Error updating task'));
        })
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Error deleting task'));
        })
      );
  }
} 