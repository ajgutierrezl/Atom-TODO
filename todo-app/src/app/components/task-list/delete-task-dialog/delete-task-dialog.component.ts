import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-delete-task-dialog',
  templateUrl: './delete-task-dialog.component.html',
  styleUrls: ['./delete-task-dialog.component.scss']
})
export class DeleteTaskDialogComponent {
  isLoading = false;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task }
  ) {}
  
  onCancel(): void {
    this.dialogRef.close(false);
  }
  
  onConfirm(): void {
    this.isLoading = true;
    this.dialogRef.close(true);
  }
} 