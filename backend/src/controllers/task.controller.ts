import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  findAll = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const tasks = await this.taskService.findAll(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error in findAll:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  findOne = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.sub;

      if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
      }

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const task = await this.taskService.findOne(id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (task.userId !== userId) {
        res.status(403).json({ error: 'Forbidden - Task belongs to another user' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Error in findOne:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const taskDTO = req.body as Omit<CreateTaskDTO, 'userId'>;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (!taskDTO.title || !taskDTO.description) {
        res.status(400).json({ error: 'Title and description are required' });
        return;
      }

      const taskWithUserId: CreateTaskDTO = {
        ...taskDTO,
        userId
      };

      const newTask = await this.taskService.create(taskWithUserId);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.sub;
      const taskDTO = req.body as UpdateTaskDTO;

      if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
      }

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (Object.keys(taskDTO).length === 0) {
        res.status(400).json({ error: 'No data to update' });
        return;
      }

      const existingTask = await this.taskService.findOne(id);

      if (!existingTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (existingTask.userId !== userId) {
        res.status(403).json({ error: 'Forbidden - Task belongs to another user' });
        return;
      }

      const updatedTask = await this.taskService.update(id, taskDTO);
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.sub;

      if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
      }

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const existingTask = await this.taskService.findOne(id);

      if (!existingTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      if (existingTask.userId !== userId) {
        res.status(403).json({ error: 'Forbidden - Task belongs to another user' });
        return;
      }

      const result = await this.taskService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 