import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const authRouter = Router();
const userController = new UserController();

// Rutas públicas
authRouter.post('/login', userController.login);
authRouter.post('/register', userController.create);

// Rutas protegidas
authRouter.get('/profile', authMiddleware, userController.getProfile);
authRouter.post('/refresh-token', authMiddleware, userController.refreshToken);

export default authRouter; 