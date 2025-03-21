import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

// Asegúrate de que siempre hay un valor de fallback
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class TokenService {
  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000)
    };

    // Usando any para evitar problemas de tipo
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