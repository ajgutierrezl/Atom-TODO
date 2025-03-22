import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Task } from '../../models/task.model';
import { formatDate } from '@angular/common';

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskToggled = new EventEmitter<Task>();
  @Output() taskEdited = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<Task>();

  onToggle(event: MatCheckboxChange): void {
    this.taskToggled.emit(this.task);
  }

  onEdit(): void {
    this.taskEdited.emit(this.task);
  }

  onDelete(): void {
    this.taskDeleted.emit(this.task);
  }

  get createdAtFormatted(): string {
    try {
      const timestamp = this.task.createdAt as unknown as FirestoreTimestamp;
      if (timestamp && timestamp._seconds) {
        const date = new Date(timestamp._seconds * 1000);
        return formatDate(date, 'dd/MM/yyyy HH:mm', 'en-US');
      }
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }

  get hasPriority(): boolean {
    return !!this.task.priority;
  }

  get priorityIcon(): string {
    if (!this.task.priority) return 'drag_handle';
    
    switch (this.task.priority) {
      case 'high': return 'priority_high';
      case 'medium': return 'drag_handle';
      case 'low': return 'low_priority';
      default: return 'drag_handle';
    }
  }

  get priorityLabel(): string {
    if (!this.task.priority) return 'Media';
    
    switch (this.task.priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  }

  get priorityClass(): string {
    return `priority-${this.task.priority || 'medium'}`;
  }
}
