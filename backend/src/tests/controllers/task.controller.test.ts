// Mocks para los métodos del TaskService
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

// Mock TaskService
jest.mock('../../services/task.service', () => {
  return {
    TaskService: jest.fn().mockImplementation(() => {
      return {
        findAll: mockFindAll,
        findOne: mockFindOne,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete
      };
    })
  };
});

// Ahora importamos después de mockar
import { Response } from 'express';
import { TaskController } from '../../controllers/task.controller';
import { Task } from '../../models/task.model';
import { AuthRequest } from '../../middleware/auth.middleware';

describe('TaskController', () => {
  let taskController: TaskController;
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  
  const mockUserId = '123';
  const mockTaskId = '456';
  
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      user: { sub: mockUserId }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create controller with mocked service
    taskController = new TaskController();
  });
  
  describe('findAll', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await taskController.findAll(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return tasks for authenticated user', async () => {
      // Arrange
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          userId: mockUserId,
          createdAt: new Date()
        }
      ];
      
      mockFindAll.mockResolvedValue(mockTasks);
      
      // Act
      await taskController.findAll(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindAll).toHaveBeenCalledWith(mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });
  });
  
  describe('findOne', () => {
    it('should return 400 if id is not provided', async () => {
      // Act
      await taskController.findOne(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Id is required' });
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.user = undefined;
      
      // Act
      await taskController.findOne(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockFindOne.mockResolvedValue(null);
      
      // Act
      await taskController.findOne(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
    
    it('should return 403 if task belongs to another user', async () => {
      // Arrange
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Task',
        description: 'Description',
        completed: false,
        userId: 'different-user-id',
        createdAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockFindOne.mockResolvedValue(mockTask);
      
      // Act
      await taskController.findOne(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden - Task belongs to another user' });
    });
    
    it('should return task if it belongs to the authenticated user', async () => {
      // Arrange
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Task',
        description: 'Description',
        completed: false,
        userId: mockUserId,
        createdAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockFindOne.mockResolvedValue(mockTask);
      
      // Act
      await taskController.findOne(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
  });
  
  describe('create', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await taskController.create(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 400 if title or description is missing', async () => {
      // Act
      await taskController.create(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Title and description are required' });
    });
    
    it('should create and return task', async () => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'New Description'
      };
      
      const taskWithUserId = {
        ...taskData,
        userId: mockUserId
      };
      
      const mockTask: Task = {
        id: mockTaskId,
        ...taskWithUserId,
        completed: false,
        createdAt: new Date()
      };
      
      mockRequest.body = taskData;
      mockCreate.mockResolvedValue(mockTask);
      
      // Act
      await taskController.create(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockCreate).toHaveBeenCalledWith(taskWithUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
  });
  
  describe('update', () => {
    it('should return 400 if id is not provided', async () => {
      // Act
      await taskController.update(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Id is required' });
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.user = undefined;
      
      // Act
      await taskController.update(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 400 if no update data is provided', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      
      // Act
      await taskController.update(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No data to update' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.body = { title: 'Updated Title' };
      mockFindOne.mockResolvedValue(null);
      
      // Act
      await taskController.update(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
    
    it('should return 403 if task belongs to another user', async () => {
      // Arrange
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Task',
        description: 'Description',
        completed: false,
        userId: 'different-user-id',
        createdAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockRequest.body = { title: 'Updated Title' };
      mockFindOne.mockResolvedValue(mockTask);
      
      // Act
      await taskController.update(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden - Task belongs to another user' });
    });
    
    it('should update and return task', async () => {
      // Arrange
      const existingTask: Task = {
        id: mockTaskId,
        title: 'Original Title',
        description: 'Original Description',
        completed: false,
        userId: mockUserId,
        createdAt: new Date()
      };
      
      const updateData = { title: 'Updated Title' };
      
      const updatedTask: Task = {
        ...existingTask,
        ...updateData
      };
      
      mockRequest.params = { id: mockTaskId };
      mockRequest.body = updateData;
      mockFindOne.mockResolvedValue(existingTask);
      mockUpdate.mockResolvedValue(updatedTask);
      
      // Act
      await taskController.update(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockUpdate).toHaveBeenCalledWith(mockTaskId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedTask);
    });
  });
  
  describe('delete', () => {
    it('should return 400 if id is not provided', async () => {
      // Act
      await taskController.delete(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Id is required' });
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.user = undefined;
      
      // Act
      await taskController.delete(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockFindOne.mockResolvedValue(null);
      
      // Act
      await taskController.delete(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
    
    it('should return 403 if task belongs to another user', async () => {
      // Arrange
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Task',
        description: 'Description',
        completed: false,
        userId: 'different-user-id',
        createdAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockFindOne.mockResolvedValue(mockTask);
      
      // Act
      await taskController.delete(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Forbidden - Task belongs to another user' });
    });
    
    it('should delete task and return 204', async () => {
      // Arrange
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Task',
        description: 'Description',
        completed: false,
        userId: mockUserId,
        createdAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockFindOne.mockResolvedValue(mockTask);
      mockDelete.mockResolvedValue(true);
      
      // Act
      await taskController.delete(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindOne).toHaveBeenCalledWith(mockTaskId);
      expect(mockDelete).toHaveBeenCalledWith(mockTaskId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
}); 