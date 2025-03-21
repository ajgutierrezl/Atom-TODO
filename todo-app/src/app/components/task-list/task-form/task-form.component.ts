import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Task Title</mat-label>
        <input matInput #titleInput formControlName="title" placeholder="Enter task title">
        <mat-error *ngIf="taskForm.get('title')?.errors?.['required']">
          Title is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" placeholder="Enter task description" rows="3"></textarea>
        <mat-error *ngIf="taskForm.get('description')?.errors?.['required']">
          Description is required
        </mat-error>
      </mat-form-field>

      <div class="form-actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="taskForm.invalid || isSubmitting">
          <mat-icon>add</mat-icon>
          Add Task
        </button>
      </div>
    </form>
  `,
  styles: [`
    .task-form {
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 24px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    textarea {
      resize: none;
    }
  `]
})
export class TaskFormComponent {
  @ViewChild('titleInput') titleInput!: ElementRef;
  @Output() taskCreated = new EventEmitter<void>();
  
  taskForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public el: ElementRef
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  focusTitleInput(): void {
    if (this.titleInput) {
      this.titleInput.nativeElement.focus();
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.snackBar.open('Task created successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.taskForm.reset();
          this.isSubmitting = false;
          this.taskCreated.emit();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.snackBar.open('Error creating task', 'Close', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
          this.isSubmitting = false;
        }
      });
    }
  }
} 