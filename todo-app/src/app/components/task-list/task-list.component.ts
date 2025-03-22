import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, Subject } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Task, FirestoreTimestamp } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { EditTaskDialogComponent } from './edit-task-dialog/edit-task-dialog.component';
import { DeleteTaskDialogComponent } from './delete-task-dialog/delete-task-dialog.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]> = of([]);
  isLoading = true;
  error = false;
  completedTasks: Task[] = [];
  sortOption: 'date' | 'priority' = 'date';
  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initSearchListener();
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.loadTasks(value || '');
      });
  }

  loadTasks(searchTerm: string | null | undefined = ''): void {
    this.isLoading = true;
    this.error = false;

    // Convertir null o undefined a string vacía
    const search = searchTerm || '';
    console.log('Loading tasks with search term:', search);

    this.tasks$ = this.taskService.getTasks(search).pipe(
      tap(tasks => {
        console.log(`Received ${tasks.length} tasks from server`);
        try {
          const sortedTasks = this.sortOption === 'date' 
            ? this.sortTasksByDate(tasks)
            : this.sortTasksByPriority(tasks);
          this.completedTasks = sortedTasks.filter(task => task.completed);
        } catch (err) {
          console.error('Error sorting tasks:', err);
          // Si hay error en el ordenamiento, al menos mostramos las tareas
          this.completedTasks = tasks.filter(task => task.completed);
        }
      }),
      catchError(error => {
        console.error('Error loading tasks:', error);
        this.error = true;
        this.isLoading = false;
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  private sortTasksByDate(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        const timestampA = a.createdAt as FirestoreTimestamp;
        const timestampB = b.createdAt as FirestoreTimestamp;
        return timestampB._seconds - timestampA._seconds;
      }
      return a.completed ? 1 : -1;
    });
  }

  private sortTasksByPriority(tasks: Task[]): Task[] {
    const priorityWeight = {
      'high': 3,
      'medium': 2,
      'low': 1
    };

    return tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        // Ordenar por prioridad (alto a bajo)
        // Usar 'medium' como valor por defecto si no existe la prioridad
        const priorityA = a.priority ? priorityWeight[a.priority] : priorityWeight['medium'];
        const priorityB = b.priority ? priorityWeight[b.priority] : priorityWeight['medium'];
        
        if (priorityA === priorityB) {
          // Si la prioridad es igual, ordenar por fecha
          const timestampA = a.createdAt as FirestoreTimestamp;
          const timestampB = b.createdAt as FirestoreTimestamp;
          return timestampB._seconds - timestampA._seconds;
        }
        
        return priorityB - priorityA;
      }
      return a.completed ? 1 : -1;
    });
  }

  changeSortOption(option: 'date' | 'priority' | any): void {
    // Asegurar que la opción recibida es válida
    const validOption = option === 'date' || option === 'priority' ? option : 'date';
    this.sortOption = validOption;
    this.loadTasks();
  }

  getCompletedCount(): number {
    return this.completedTasks.length;
  }

  onTaskToggle(task: Task): void {
    if (!task.id) {
      console.error('Task ID is missing');
      return;
    }

    this.isLoading = true;
    
    const updatedTask: Partial<Task> = {
      completed: !task.completed
    };
    
    this.taskService.updateTask(task.id, updatedTask).pipe(
      finalize(() => {
        this.isLoading = false;
        this.loadTasks();
      })
    ).subscribe({
      error: (error) => {
        this.snackBar.open('Error updating task status', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
        console.error('Error toggling task:', error);
      }
    });
  }

  onTaskEdit(task: Task): void {
    if (!task.id) {
      console.error('Task ID is missing');
      return;
    }

    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: { task: { ...task } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        
        this.taskService.updateTask(task.id, result).pipe(
          finalize(() => {
            this.isLoading = false;
            this.loadTasks();
          })
        ).subscribe({
          next: () => {
            this.snackBar.open('Task updated successfully', 'Close', { 
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          },
          error: (error) => {
            this.snackBar.open('Error updating task', 'Close', { 
              duration: 3000,
              panelClass: 'error-snackbar'
            });
            console.error('Error updating task:', error);
          }
        });
      }
    });
  }

  onTaskDelete(task: Task): void {
    if (!task.id) {
      console.error('Task ID is missing');
      return;
    }

    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      width: '450px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        
        this.taskService.deleteTask(task.id).pipe(
          finalize(() => {
            this.isLoading = false;
            this.loadTasks();
          })
        ).subscribe({
          next: () => {
            this.snackBar.open('Task deleted successfully', 'Close', { 
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          },
          error: (error) => {
            this.snackBar.open('Error deleting task', 'Close', { 
              duration: 3000,
              panelClass: 'error-snackbar'
            });
            console.error('Error deleting task:', error);
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  trackById(index: number, task: Task): string {
    return task.id || '';
  }
}
