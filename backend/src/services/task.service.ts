import { db } from '../config/firebase';
import { Task, CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

export class TaskService {
  private collection = db.collection('tasks');

  async findAll(userId: string): Promise<Task[]> {
    // Get tasks only by userId without ordering to avoid needing a composite index
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .get();

    const tasks = snapshot.docs.map((doc: any) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate()
      };
    });
    
    // Sort results in memory
    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findOne(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as any;
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate()
    };
  }

  async create(taskDTO: CreateTaskDTO): Promise<Task> {
    const task: Omit<Task, 'id'> = {
      ...taskDTO,
      createdAt: new Date()
    };

    const docRef = await this.collection.add(task);
    const doc = await docRef.get();
    
    return {
      id: doc.id,
      ...task
    };
  }

  async update(id: string, taskDTO: UpdateTaskDTO): Promise<Task | null> {
    const taskRef = this.collection.doc(id);
    const task = await this.findOne(id);
    
    if (!task) {
      return null;
    }

    // Convert the DTO to an object that Firestore can accept
    const updateData: {[key: string]: any} = {};
    
    // Only include fields that are provided in the DTO
    if (taskDTO.title !== undefined) updateData.title = taskDTO.title;
    if (taskDTO.description !== undefined) updateData.description = taskDTO.description;
    if (taskDTO.completed !== undefined) updateData.completed = taskDTO.completed;

    await taskRef.update(updateData);
    
    return {
      ...task,
      ...taskDTO
    };
  }

  async delete(id: string): Promise<boolean> {
    const taskRef = this.collection.doc(id);
    const task = await this.findOne(id);
    
    if (!task) {
      return false;
    }

    await taskRef.delete();
    
    return true;
  }
} 