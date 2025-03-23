import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  getTasks(page: number = 0, limit: number = 10, search?: string): Observable<{items: Task[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<{items: Task[], total: number}>(this.apiUrl, { params });
  }

  // Método para buscar localmente las tareas (como alternativa)
  searchTasks(tasks: Task[], searchTerm: string | null): Task[] {
    if (!searchTerm || !searchTerm.trim()) {
      return tasks;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(term) || 
      (task.description && task.description.toLowerCase().includes(term))
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