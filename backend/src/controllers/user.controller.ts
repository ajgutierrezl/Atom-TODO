import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { UserDTO } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class UserController {
  private userService: UserService;
  private tokenService: TokenService;

  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body as UserDTO;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const existingUser = await this.userService.findByEmail(email);

      if (!existingUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Generar token JWT
      const token = this.tokenService.generateToken(existingUser);

      res.status(200).json({
        user: existingUser,
        token
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body as UserDTO;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const existingUser = await this.userService.findByEmail(email);

      if (existingUser) {
        res.status(409).json({ error: 'User already exists' });
        return;
      }

      const newUser = await this.userService.create({ email });
      
      // Generar token JWT
      const token = this.tokenService.generateToken(newUser);

      res.status(201).json({
        user: newUser,
        token
      });
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userService.findById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.sub;
      
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await this.userService.findById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Generar nuevo token
      const token = this.tokenService.generateToken(user);

      res.status(200).json({ token });
    } catch (error) {
      console.error('Error in refreshToken:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 