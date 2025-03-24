// Mock jwt if necessary
jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn().mockImplementation(() => 'mocked-token'),
    verify: jest.fn().mockImplementation((token) => {
      if (token === 'valid-token') {
        return { sub: '123', email: 'test@example.com' };
      }
      throw new Error('Invalid token');
    }),
    decode: jest.fn().mockImplementation((token) => {
      if (token) {
        return { sub: '123', email: 'test@example.com' };
      }
      return null;
    })
  };
});

// Now import the real components
import { TokenService } from '../../services/token.service';
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';

describe('TokenService', () => {
  let tokenService: TokenService;
  let mockUser: User;

  beforeEach(() => {
    // Clean mocks before each test
    jest.clearAllMocks();
    
    tokenService = new TokenService();
    mockUser = {
      id: '123',
      email: 'test@example.com',
      createdAt: new Date()
    };
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      // Act
      const token = tokenService.generateToken(mockUser);

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      // Act
      const result = tokenService.verifyToken('valid-token');

      // Assert
      expect(result).toBeDefined();
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.anything());
    });

    it('should return null for an invalid token', () => {
      // Mock para que verify lance un error con tokens inválidos
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      // Act
      const result = tokenService.verifyToken('invalid-token');

      // Assert
      expect(result).toBeNull();
      expect(jwt.verify).toHaveBeenCalledWith('invalid-token', expect.anything());
    });
  });

  describe('decodeToken', () => {
    it('should decode a token without verifying', () => {
      // Act
      const result = tokenService.decodeToken('any-token');

      // Assert
      expect(result).toBeDefined();
      expect(jwt.decode).toHaveBeenCalledWith('any-token');
    });

    it('should return null for an invalid token format', () => {
      // Mock para que decode retorne null cuando recibe un token vacío
      (jwt.decode as jest.Mock).mockImplementationOnce(() => null);
      
      // Act
      const result = tokenService.decodeToken('');
      
      // Assert
      expect(result).toBeNull();
      expect(jwt.decode).toHaveBeenCalledWith('');
    });
  });
}); 