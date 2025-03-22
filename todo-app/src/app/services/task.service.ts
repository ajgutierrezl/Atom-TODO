import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getTasks(searchTerm?: string | null): Observable<Task[]> {
    let params = new HttpParams();
    
    if (searchTerm && searchTerm.trim()) {
      params = params.set('search', searchTerm.trim());
      console.log('Searching with term:', searchTerm.trim());
    }
    
    return this.http.get<TasksResponse | Task[]>(this.apiUrl, { params })
      .pipe(
        map(response => {
          if (response && 'tasks' in response && Array.isArray(response.tasks)) {
            console.log(`Response contains ${response.tasks.length} of ${response.total} total tasks`);
            return response.tasks || [];
          } else if (Array.isArray(response)) {
            console.log(`Response is an array with ${response.length} tasks`);
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