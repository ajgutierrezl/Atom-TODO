export interface TaskDTO {
  title: string;
  description?: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface Task extends TaskDTO {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

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