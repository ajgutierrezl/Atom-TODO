// Mocks para los métodos de servicios
const mockFindByEmail = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockGenerateToken = jest.fn();

// Mock UserService
jest.mock('../../services/user.service', () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return {
        findByEmail: mockFindByEmail,
        findById: mockFindById,
        create: mockCreate
      };
    })
  };
});

// Mock TokenService
jest.mock('../../services/token.service', () => {
  return {
    TokenService: jest.fn().mockImplementation(() => {
      return {
        generateToken: mockGenerateToken
      };
    })
  };
});

// Ahora importamos los componentes después de haber definido los mocks
import { Request, Response } from 'express';
import { UserController } from '../../controllers/user.controller';
import { User } from '../../models/user.model';
import { AuthRequest } from '../../middleware/auth.middleware';

describe('UserController', () => {
  let userController: UserController;
  let mockRequest: Partial<Request | AuthRequest>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      user: undefined
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create controller with mocked services
    userController = new UserController();
  });
  
  describe('login', () => {
    it('should return 400 if email is missing', async () => {
      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email is required' });
    });
    
    it('should return 404 if user is not found', async () => {
      // Arrange
      mockRequest.body = { email: 'test@example.com' };
      mockFindByEmail.mockResolvedValue(null);
      
      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    
    it('should return user and token if login is successful', async () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        createdAt: new Date()
      };
      const mockToken = 'test-token';
      
      mockRequest.body = { email: 'test@example.com' };
      mockFindByEmail.mockResolvedValue(mockUser);
      mockGenerateToken.mockReturnValue(mockToken);
      
      // Act
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockGenerateToken).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: mockToken
      });
    });
  });
  
  describe('create', () => {
    it('should return 400 if email is missing', async () => {
      // Act
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email is required' });
    });
    
    it('should return 409 if user already exists', async () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        createdAt: new Date()
      };
      
      mockRequest.body = { email: 'test@example.com' };
      mockFindByEmail.mockResolvedValue(mockUser);
      
      // Act
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
    
    it('should create user and return user with token', async () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        createdAt: new Date()
      };
      const mockToken = 'test-token';
      
      mockRequest.body = { email: 'test@example.com' };
      mockFindByEmail.mockResolvedValue(null);
      mockCreate.mockResolvedValue(mockUser);
      mockGenerateToken.mockReturnValue(mockToken);
      
      // Act
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockCreate).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockGenerateToken).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: mockToken
      });
    });
  });
  
  describe('getProfile', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Act
      await userController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 404 if user is not found', async () => {
      // Arrange
      (mockRequest as AuthRequest).user = { sub: '123' };
      mockFindById.mockResolvedValue(null);
      
      // Act
      await userController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindById).toHaveBeenCalledWith('123');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    
    it('should return user profile if authenticated', async () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        createdAt: new Date()
      };
      
      (mockRequest as AuthRequest).user = { sub: '123' };
      mockFindById.mockResolvedValue(mockUser);
      
      // Act
      await userController.getProfile(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindById).toHaveBeenCalledWith('123');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });
  
  describe('refreshToken', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Act
      await userController.refreshToken(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 404 if user is not found', async () => {
      // Arrange
      (mockRequest as AuthRequest).user = { sub: '123' };
      mockFindById.mockResolvedValue(null);
      
      // Act
      await userController.refreshToken(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindById).toHaveBeenCalledWith('123');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    
    it('should return new token if user is authenticated', async () => {
      // Arrange
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        createdAt: new Date()
      };
      const mockToken = 'new-token';
      
      (mockRequest as AuthRequest).user = { sub: '123' };
      mockFindById.mockResolvedValue(mockUser);
      mockGenerateToken.mockReturnValue(mockToken);
      
      // Act
      await userController.refreshToken(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockFindById).toHaveBeenCalledWith('123');
      expect(mockGenerateToken).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });
}); 