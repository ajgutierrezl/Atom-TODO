import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

// Ensure there is always a fallback value
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class TokenService {
  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    };

    // Using any to avoid type issues
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
} 