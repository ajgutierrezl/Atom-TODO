import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const taskRouter = Router();
const taskController = new TaskController();

// Todas las rutas de tareas requieren autenticación
taskRouter.use(authMiddleware);

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