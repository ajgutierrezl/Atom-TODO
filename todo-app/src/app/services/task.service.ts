import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment';

interface TasksResponse {
  tasks: Task[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient
  ) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<TasksResponse | Task[]>(this.apiUrl)
      .pipe(
        map(response => {
          if (response && 'tasks' in response && Array.isArray(response.tasks)) {
            console.log('Response is TasksResponse format:', response);
            return response.tasks || [];
          } else if (Array.isArray(response)) {
            console.log('Response is Task[] format:', response);
            return response;
          } else {
            console.warn('Unexpected response format:', response);
            return [];
          }
        }),
        catchError(error => {
          console.error('Error fetching tasks:', error);
          return throwError(() => new Error('Error getting tasks'));
        })
      );
  }

  createTask(taskData: {title: string, description: string, priority?: 'high' | 'medium' | 'low'}): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, {
      ...taskData,
      completed: false,
      priority: taskData.priority || 'medium'
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