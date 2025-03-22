export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
  userId: string;
} 