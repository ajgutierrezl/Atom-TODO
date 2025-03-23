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

// No necesitamos el Schema de Mongoose ya que usamos Firebase

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