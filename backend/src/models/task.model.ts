export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  userId: string;
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