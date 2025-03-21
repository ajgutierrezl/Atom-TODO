import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UserDTO } from '../models/user.model';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
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

      res.status(200).json(existingUser);
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
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error in create:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 