import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @ViewChild(TaskFormComponent) taskForm!: TaskFormComponent;
  
  tasks$: Observable<Task[]> = of([]);
  isLoading = false;
  error = false;
  completedTasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.error = false;

    this.tasks$ = this.taskService.getTasks().pipe(
      tap(tasks => {
        // Sort tasks: pending first, then completed
        tasks.sort((a, b) => {
          if (a.completed === b.completed) {
            // If both have the same status, sort by date (most recent first)
            return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
          }
          // Pending first
          return a.completed ? 1 : -1;
        });

        // Save completed tasks for statistics
        this.completedTasks = tasks.filter(task => task.completed);
      }),
      catchError(error => {
        this.error = true;
        console.error('Error loading tasks:', error);
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  getCompletedCount(): number {
    return this.completedTasks.length;
  }

  focusTaskForm(): void {
    if (this.taskForm) {
      // Scroll to the form and focus the first field
      const formElement = this.taskForm.el.nativeElement;
      formElement.scrollIntoView({ behavior: 'smooth' });
      
      // Focus on the title after a small delay to allow time for scrolling
      setTimeout(() => {
        this.taskForm.focusTitleInput();
      }, 500);
    }
  }

  onTaskToggle(task: Task): void {
    this.isLoading = true;
    
    const updatedTask: Partial<Task> = {
      completed: !task.completed
    };
    
    this.taskService.updateTask(task.id!, updatedTask).pipe(
      finalize(() => {
        this.isLoading = false;
        this.loadTasks();
      })
    ).subscribe({
      error: (error) => {
        console.error('Error toggling task:', error);
      }
    });
  }

  onTaskEdit(task: Task): void {
    // Implementation of the edit method
    console.log('Editing task:', task);
  }

  onTaskDelete(taskId: string): void {
    this.isLoading = true;
    
    this.taskService.deleteTask(taskId).pipe(
      finalize(() => {
        this.isLoading = false;
        this.loadTasks();
      })
    ).subscribe({
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Function for trackBy
  trackById(index: number, task: Task): string {
    return task.id!;
  }
}
