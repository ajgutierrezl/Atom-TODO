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
    this.editForm.patchValue({
      title: this.data.task.title,
      description: this.data.task.description,
      completed: this.data.task.completed,
      priority: this.data.task.priority || 'medium'
    });
  }

  getPriorityInfo(value: string) {
    return this.priorityOptions.find(option => option.value === value) || this.priorityOptions[1];
  }
  
  onSubmit(): void {
    if (this.editForm.invalid) return;
    
    this.isLoading = true;
    const updatedTask = {
      ...this.data.task,
      ...this.editForm.value
    };
    
    this.dialogRef.close(updatedTask);
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
} 