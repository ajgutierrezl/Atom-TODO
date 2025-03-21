import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient
  ) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Error getting tasks'));
        })
      );
  }

  createTask(taskData: {title: string, description: string}): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, {
      ...taskData,
      completed: false
    }).pipe(
      catchError(error => {
        return throwError(() => new Error('Error creating task'));
      })
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Error updating task'));
        })
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Error deleting task'));
        })
      );
  }
} 