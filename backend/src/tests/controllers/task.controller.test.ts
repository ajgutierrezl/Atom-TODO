// Mocks for the TaskService methods
const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

// Mock TaskService
jest.mock('../../services/task.service', () => {
  return {
    TaskService: jest.fn().mockImplementation(() => {
      return {
        findAll: mockFindAll,
        findById: mockFindById,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete
      };
    })
  };
});

// Now import after mocking
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
  
  describe('getTasks', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await taskController.getTasks(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuario no autorizado' });
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
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockFindAll.mockResolvedValue(mockTasks);
      
      // Act
      await taskController.getTasks(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindAll).toHaveBeenCalledWith(mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });
  });
  
  describe('getTask', () => {
    it('should return 400 if id is not provided', async () => {
      // Act
      await taskController.getTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ID de tarea requerido' });
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.user = undefined;
      
      // Act
      await taskController.getTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuario no autorizado' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockFindById.mockResolvedValue(null);
      
      // Act
      await taskController.getTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Tarea no encontrada' });
    });
    
    it('should return task if it belongs to the authenticated user', async () => {
      // Arrange
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Task',
        description: 'Description',
        completed: false,
        userId: mockUserId,
        priority: 'low',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockFindById.mockResolvedValue(mockTask);
      
      // Act
      await taskController.getTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockFindById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
  });
  
  describe('createTask', () => {
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      await taskController.createTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuario no autorizado' });
    });
    
    it('should return 400 if title is missing', async () => {
      // Act
      await taskController.createTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'El título es requerido' });
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
        priority: 'high',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.body = taskData;
      mockCreate.mockResolvedValue(mockTask);
      
      // Act
      await taskController.createTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockCreate).toHaveBeenCalledWith(taskWithUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
  });
  
  describe('updateTask', () => {
    it('should return 400 if id is not provided', async () => {
      // Act
      await taskController.updateTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ID de tarea requerido' });
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.user = undefined;
      
      // Act
      await taskController.updateTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuario no autorizado' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockUpdate.mockResolvedValue(null);
      
      // Act
      await taskController.updateTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockUpdate).toHaveBeenCalledWith(mockTaskId, mockUserId, {});
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Tarea no encontrada' });
    });
    
    it('should update and return task', async () => {
      // Arrange
      const updateData = {
        title: 'Updated Task',
        completed: true
      };
      
      const mockTask: Task = {
        id: mockTaskId,
        title: 'Updated Task',
        description: 'Original Description',
        completed: true,
        userId: mockUserId,
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: mockTaskId };
      mockRequest.body = updateData;
      mockUpdate.mockResolvedValue(mockTask);
      
      // Act
      await taskController.updateTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockUpdate).toHaveBeenCalledWith(mockTaskId, mockUserId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });
  });
  
  describe('deleteTask', () => {
    it('should return 400 if id is not provided', async () => {
      // Act
      await taskController.deleteTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ID de tarea requerido' });
    });
    
    it('should return 401 if user is not authenticated', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockRequest.user = undefined;
      
      // Act
      await taskController.deleteTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuario no autorizado' });
    });
    
    it('should return 404 if task is not found', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockDelete.mockResolvedValue(false);
      
      // Act
      await taskController.deleteTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockDelete).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Tarea no encontrada' });
    });
    
    it('should delete task and return 204', async () => {
      // Arrange
      mockRequest.params = { id: mockTaskId };
      mockDelete.mockResolvedValue(true);
      
      // Act
      await taskController.deleteTask(mockRequest as AuthRequest, mockResponse as Response);
      
      // Assert
      expect(mockDelete).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
}); 