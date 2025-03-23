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
  priorityOptions = [
    { value: 'high', label: 'Alta', icon: 'priority_high' },
    { value: 'medium', label: 'Media', icon: 'drag_handle' },
    { value: 'low', label: 'Baja', icon: 'low_priority' }
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public el: ElementRef
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      priority: ['medium', Validators.required]
    });
  }

  getPriorityInfo(value: string) {
    return this.priorityOptions.find(option => option.value === value) || this.priorityOptions[1];
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.taskForm.value;

    this.taskService.createTask(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.taskForm.reset({
          priority: 'medium'
        });
        this.snackBar.open('Tarea creada exitosamente', 'Cerrar', { 
          duration: 3000,
          panelClass: 'success-snackbar'
        });
        this.taskCreated.emit();
      },
      error: (error) => {
        console.error('Error al crear la tarea:', error);
        this.isLoading = false;
        this.snackBar.open('Error al crear la tarea', 'Cerrar', { 
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  focusTitleInput(): void {
    if (this.titleInput) {
      this.titleInput.nativeElement.focus();
    }
  }
}
