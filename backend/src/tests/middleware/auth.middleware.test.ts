// Primero hacemos el mock antes de importar cualquier cosa
const mockVerifyToken = jest.fn();

jest.mock('../../services/token.service', () => {
  return {
    TokenService: jest.fn().mockImplementation(() => {
      return {
        verifyToken: mockVerifyToken
      };
    })
  };
});

// Ahora importamos el resto después de definir los mocks
import { Response, NextFunction } from 'express';
import { authMiddleware, optionalAuthMiddleware, AuthRequest } from '../../middleware/auth.middleware';

describe('Auth Middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      user: undefined
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    nextFunction = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('authMiddleware', () => {
    it('should return 401 if no authorization header is provided', () => {
      // Act
      authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if authorization format is invalid', () => {
      // Arrange
      mockRequest.headers = { authorization: 'InvalidFormat' };

      // Act
      authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token error' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification fails', () => {
      // Arrange
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      mockVerifyToken.mockReturnValue(null);

      // Act
      authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('invalid-token');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Invalid token' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should add user to request and call next if token is valid', () => {
      // Arrange
      const decodedUser = { sub: '123', email: 'test@example.com' };
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      mockVerifyToken.mockReturnValue(decodedUser);

      // Act
      authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual(decodedUser);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('optionalAuthMiddleware', () => {
    it('should call next if no authorization header is provided', () => {
      // Act
      optionalAuthMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should call next if authorization format is invalid', () => {
      // Arrange
      mockRequest.headers = { authorization: 'InvalidFormat' };

      // Act
      optionalAuthMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should not set user if token verification fails', () => {
      // Arrange
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      mockVerifyToken.mockReturnValue(null);

      // Act
      optionalAuthMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('invalid-token');
      expect(mockRequest.user).toBeUndefined();
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should add user to request if token is valid', () => {
      // Arrange
      const decodedUser = { sub: '123', email: 'test@example.com' };
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      mockVerifyToken.mockReturnValue(decodedUser);

      // Act
      optionalAuthMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockRequest.user).toEqual(decodedUser);
      expect(nextFunction).toHaveBeenCalled();
    });
  });
}); 