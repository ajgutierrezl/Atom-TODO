import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        res.status(400).json({ error: 'UserId is required' });
        return;
      }

      const tasks = await this.taskService.findAll(userId);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error in findAll:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
      }

      const task = await this.taskService.findOne(id);

      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Error in findOne:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskDTO = req.body as CreateTaskDTO;

      if (!taskDTO.title || !taskDTO.description || !taskDTO.userId) {
        res.status(400).json({ error: 'Incomplete data' });
        return;
      }

      const newTask = await this.taskService.create(taskDTO);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const taskDTO = req.body as UpdateTaskDTO;

      if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
      }

      if (Object.keys(taskDTO).length === 0) {
        res.status(400).json({ error: 'No data to update' });
        return;
      }

      const updatedTask = await this.taskService.update(id, taskDTO);

      if (!updatedTask) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error in update:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
      }

      const result = await this.taskService.delete(id);

      if (!result) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 