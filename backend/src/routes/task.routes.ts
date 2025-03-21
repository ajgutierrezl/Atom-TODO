import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const taskRouter = Router();
const taskController = new TaskController();

// Todas las rutas de tareas requieren autenticación
taskRouter.use(authMiddleware);

// Rutas CRUD para tareas
taskRouter.get('/', taskController.getTasks);
taskRouter.get('/:id', taskController.getTask);
taskRouter.post('/', taskController.createTask);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter; 