import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() taskToggled = new EventEmitter<void>();
  @Output() taskEdited = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<void>();

  get createdAtFormatted(): string {
    const date = this.task.createdAt instanceof Date 
      ? this.task.createdAt 
      : new Date(this.task.createdAt);
      
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onTaskToggle(): void {
    this.taskToggled.emit();
  }

  onTaskEdit(): void {
    this.taskEdited.emit();
  }

  onTaskDelete(): void {
    this.taskDeleted.emit();
  }
}
