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

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { title, description, priority } = this.taskForm.value;

    console.log('Creating task with priority:', priority);

    this.taskService.createTask({ 
      title, 
      description,
      priority
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.taskForm.reset({
          priority: 'medium'
        });
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
  
  // Método para obtener la etiqueta de la prioridad seleccionada
  getPriorityInfo(value: string | null) {
    if (!value) return this.priorityOptions.find(opt => opt.value === 'medium');
    return this.priorityOptions.find(opt => opt.value === value) || this.priorityOptions[1]; // Default: medium
  }
}
