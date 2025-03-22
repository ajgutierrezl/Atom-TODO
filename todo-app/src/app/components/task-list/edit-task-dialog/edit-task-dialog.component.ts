import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent implements OnInit {
  editForm: FormGroup;
  isLoading = false;
  priorityOptions = [
    { value: 'high', label: 'Alta', icon: 'priority_high' },
    { value: 'medium', label: 'Media', icon: 'drag_handle' },
    { value: 'low', label: 'Baja', icon: 'low_priority' }
  ];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      completed: [false],
      priority: ['medium', Validators.required]
    });
  }
  
  ngOnInit(): void {
    console.log('Editing task:', this.data.task);
    
    // Inicializar el formulario con los datos actuales de la tarea
    this.editForm.patchValue({
      title: this.data.task.title || '',
      description: this.data.task.description || '',
      completed: this.data.task.completed || false,
      priority: this.data.task.priority || 'medium'
    });
  }
  
  onSubmit(): void {
    if (this.editForm.invalid) {
      return;
    }
    
    // Solo envía los datos editados
    const updatedTask: Partial<Task> = {
      ...this.editForm.value
    };
    
    this.dialogRef.close(updatedTask);
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  // Método para obtener la etiqueta de la prioridad seleccionada
  getPriorityInfo(value: string | null) {
    if (!value) return this.priorityOptions.find(opt => opt.value === 'medium');
    return this.priorityOptions.find(opt => opt.value === value) || this.priorityOptions[1]; // Default: medium
  }
} 