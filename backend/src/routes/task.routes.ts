import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const taskRouter = Router();
const taskController = new TaskController();

// Get all tasks by user
taskRouter.get('/', taskController.findAll);

// Get task by ID
taskRouter.get('/:id', taskController.findOne);

// Create task
taskRouter.post('/', taskController.create);

// Update task
taskRouter.put('/:id', taskController.update);

// Delete task
taskRouter.delete('/:id', taskController.delete);

export default taskRouter; 