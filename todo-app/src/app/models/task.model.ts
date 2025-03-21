export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt?: FirestoreTimestamp;
  userId: string;
} 