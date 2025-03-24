import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config();

// Configure mock environment variables for tests
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '1h';

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  if (process.env.DEBUG === 'true') {
    originalConsoleError(...args);
  }
}); 