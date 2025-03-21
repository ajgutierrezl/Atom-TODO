import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<void>();
  @ViewChild('titleInput') titleInput!: ElementRef;
  
  taskForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public el: ElementRef
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { title, description } = this.taskForm.value;

    this.taskService.createTask({ 
      title, 
      description,
      completed: false
    } as any).subscribe({
      next: () => {
        this.isLoading = false;
        this.taskForm.reset();
        this.snackBar.open('Task created successfully', 'Close', { 
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.taskCreated.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Error creating task', 'Close', { 
          duration: 3000,
          panelClass: 'error-snackbar'
        });
        console.error('Error creating task:', error);
      }
    });
  }

  focusTitleInput(): void {
    if (this.titleInput) {
      this.titleInput.nativeElement.focus();
    }
  }
}
