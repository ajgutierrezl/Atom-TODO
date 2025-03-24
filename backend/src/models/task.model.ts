export interface TaskDTO {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId: string;
}

export interface Task extends TaskDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// We don't need the Mongoose Schema since we're using Firebase

export interface CreateTaskDTO {
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
} 