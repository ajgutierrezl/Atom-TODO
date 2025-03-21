import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const userRouter = Router();
const userController = new UserController();

// Find user by email (login)
userRouter.post('/login', userController.login);

// Create user
userRouter.post('/', userController.create);

export default userRouter; 