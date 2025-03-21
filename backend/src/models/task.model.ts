export interface TaskDTO {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface Task extends TaskDTO {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  completed: boolean;
  userId: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
} 