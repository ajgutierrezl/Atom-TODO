import dotenv from 'dotenv';

// Cargar variables de entorno para las pruebas
dotenv.config();

// Configurar variables de entorno mock para pruebas
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '1h';

// Mockear console.error para evitar ruido en los tests
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  if (process.env.DEBUG === 'true') {
    originalConsoleError(...args);
  }
}); 