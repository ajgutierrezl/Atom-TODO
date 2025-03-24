import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase';
import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';
import * as functions from 'firebase-functions';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Load environment variables based on the environment
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Configure basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

// Configure Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API de Atom TODO - Documentation',
}));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

// Initialize Firebase once
let firebaseInitialized = false;
try {
  if (!firebaseInitialized) {
    initializeFirebase();
    firebaseInitialized = true;
    console.log('Firebase inicializado exitosamente en ambiente:', process.env.NODE_ENV);
  }
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

// Configure routes based on Firebase state
if (firebaseInitialized) {
  app.use('/auth', userRouter);
  app.use('/tasks', taskRouter);
} else {
  app.use('/*', (req, res) => {
    res.status(503).json({
      error: 'Servicio no disponible',
      message: 'Error en la inicialización de Firebase'
    });
  });
}

// Handle routes not found
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested route does not exist'
  });
});

// Manejo global de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado'
  });
});

// Export the function for Firebase Functions
export const api = functions.https.onRequest(app);

// Start the local server if we're not in Firebase Functions or deployment
if (!process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) {
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port} en modo ${process.env.NODE_ENV}`);
    console.log(`Estado de Firebase: ${firebaseInitialized ? 'Inicializado' : 'No inicializado'}`);
    console.log(`Documentación disponible en: http://localhost:${port}/api-docs`);
  });
} 