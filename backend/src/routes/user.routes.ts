import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const userRouter = Router();
const userController = new UserController();

// Rutas públicas
userRouter.post('/login', userController.login);
userRouter.post('/', userController.create);

// Rutas protegidas
userRouter.get('/profile', authMiddleware, userController.getProfile);
userRouter.post('/refresh-token', authMiddleware, userController.refreshToken);

export default userRouter; 