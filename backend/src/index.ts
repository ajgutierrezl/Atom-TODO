import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase';
import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';
import * as functions from 'firebase-functions';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Configurar middlewares básicos primero
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true
}));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Inicializar Firebase antes de configurar las rutas
let firebaseInitialized = false;
try {
  initializeFirebase();
  firebaseInitialized = true;
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

if (firebaseInitialized) {
  // Configurar rutas solo si Firebase está inicializado
  app.use('/auth', userRouter);
  app.use('/tasks', taskRouter);
} else {
  // Si Firebase no está inicializado, todas las rutas retornarán error 503
  app.use('/*', (req, res) => {
    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Firebase initialization failed'
    });
  });
}

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Manejador de errores global
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    path: req.path
  });
});

// Exportar la función para Firebase Functions
export const api = functions.https.onRequest(app);

// Solo iniciar el servidor si no estamos en entorno de Firebase Functions
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Estado de Firebase: ${firebaseInitialized ? 'Inicializado' : 'No inicializado'}`);
  });

  // Manejar señales de terminación
  process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    server.close(() => {
      console.log('Servidor cerrado.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT recibido. Cerrando servidor...');
    server.close(() => {
      console.log('Servidor cerrado.');
      process.exit(0);
    });
  });
} 