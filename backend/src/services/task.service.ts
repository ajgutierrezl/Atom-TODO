import { Task, TaskDTO } from '../models/task.model';
import { getFirestore } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export class TaskService {
  private collection = 'tasks';

  async findAll(
    userId: string, 
    page: number = 1, 
    limit: number = 10, 
    orderBy: string = 'createdAt', 
    order: 'asc' | 'desc' = 'desc',
    searchTerm?: string
  ): Promise<{ tasks: Task[], total: number }> {
    try {
      const db = getFirestore();
      let query = db.collection(this.collection).where('userId', '==', userId);

      console.log(`Searching for term: "${searchTerm}"`);
      
      // Si hay término de búsqueda, realizar búsqueda en el cliente
      // Firebase no permite búsquedas OR ni en múltiples campos a la vez
      let allTasks: Task[] = [];
      
      // Obtener todas las tareas del usuario
      const snapshot = await query.get();
      
      allTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      // Filtrar resultados si hay término de búsqueda
      let filteredTasks = allTasks;
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        console.log('Filtering by search term:', term);
        
        filteredTasks = allTasks.filter(task => 
          task.title.toLowerCase().includes(term) || 
          (task.description && task.description.toLowerCase().includes(term))
        );
      }
      
      // Aplicar ordenamiento
      filteredTasks.sort((a, b) => {
        if (orderBy === 'createdAt') {
          // Ordenar por fecha de creación
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 
            (a.createdAt as any)._seconds * 1000;
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 
            (b.createdAt as any)._seconds * 1000;
          
          return order === 'desc' ? timeB - timeA : timeA - timeB;
        }
        
        // Ordenamiento por otros campos
        const valueA = a[orderBy as keyof Task];
        const valueB = b[orderBy as keyof Task];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return order === 'desc' 
            ? valueB.localeCompare(valueA) 
            : valueA.localeCompare(valueB);
        }
        
        return 0;
      });
      
      // Obtener el total
      const total = filteredTasks.length;
      
      // Aplicar paginación
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedTasks = filteredTasks.slice(start, end);
      
      console.log(`Found ${total} tasks, returning ${paginatedTasks.length} tasks for page ${page}`);
      
      return {
        tasks: paginatedTasks,
        total
      };
    } catch (error) {
      console.error('Error al obtener tareas:', error);
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
        priority: taskData.priority || 'medium',
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