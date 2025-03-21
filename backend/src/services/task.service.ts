import { Task, TaskDTO } from '../models/task.model';
import { getFirestore } from '../config/firebase';

export class TaskService {
  private collection = 'tasks';

  async findAll(userId: string): Promise<Task[]> {
    try {
      const db = getFirestore();
      const snapshot = await db.collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error finding tasks:', error);
      throw error;
    }
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    try {
      const db = getFirestore();
      const doc = await db.collection(this.collection).doc(id).get();

      if (!doc.exists || doc.data()?.userId !== userId) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as Task;
    } catch (error) {
      console.error('Error finding task by id:', error);
      throw error;
    }
  }

  async create(taskData: TaskDTO & { userId: string }): Promise<Task> {
    try {
      const db = getFirestore();
      const docRef = await db.collection(this.collection).add({
        ...taskData,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const newDoc = await docRef.get();
      return {
        id: newDoc.id,
        ...newDoc.data()
      } as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id: string, userId: string, taskData: Partial<TaskDTO>): Promise<Task | null> {
    try {
      const db = getFirestore();
      const docRef = db.collection(this.collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data()?.userId !== userId) {
        return null;
      }

      await docRef.update({
        ...taskData,
        updatedAt: new Date()
      });

      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<boolean> {
    try {
      const db = getFirestore();
      const docRef = db.collection(this.collection).doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data()?.userId !== userId) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
} 