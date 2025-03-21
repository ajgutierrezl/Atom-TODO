import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { TaskDTO } from '../models/task.model';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autorizado' });
        return;
      }

      const tasks = await this.taskService.findAll(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  getTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const taskId = req.params.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autorizado' });
        return;
      }

      if (!taskId) {
        res.status(400).json({ error: 'ID de tarea requerido' });
        return;
      }

      const task = await this.taskService.findById(taskId, userId);
      
      if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Error al obtener tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const taskData = req.body as TaskDTO;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autorizado' });
        return;
      }

      if (!taskData.title) {
        res.status(400).json({ error: 'El título es requerido' });
        return;
      }

      const newTask = await this.taskService.create({
        ...taskData,
        userId
      });

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const taskId = req.params.id;
      const taskData = req.body as Partial<TaskDTO>;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autorizado' });
        return;
      }

      if (!taskId) {
        res.status(400).json({ error: 'ID de tarea requerido' });
        return;
      }

      const updatedTask = await this.taskService.update(taskId, userId, taskData);
      
      if (!updatedTask) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const taskId = req.params.id;
      
      if (!userId) {
        res.status(401).json({ error: 'Usuario no autorizado' });
        return;
      }

      if (!taskId) {
        res.status(400).json({ error: 'ID de tarea requerido' });
        return;
      }

      const deleted = await this.taskService.delete(taskId, userId);
      
      if (!deleted) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
} 