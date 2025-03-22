import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeFirebase } from './config/firebase';
import taskRouter from './routes/task.routes';
import userRouter from './routes/user.routes';
import * as functions from 'firebase-functions';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// Cargar variables de entorno según el ambiente
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Configurar middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API de Atom TODO - Documentación',
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

// Inicializar Firebase una sola vez
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

// Configurar rutas basadas en el estado de Firebase
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

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'No encontrado',
    message: 'La ruta solicitada no existe'
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

// Exportar la función para Firebase Functions
export const api = functions.https.onRequest(app);

// Iniciar el servidor local si no estamos en Firebase Functions ni en despliegue
if (!process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) {
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port} en modo ${process.env.NODE_ENV}`);
    console.log(`Estado de Firebase: ${firebaseInitialized ? 'Inicializado' : 'No inicializado'}`);
    console.log(`Documentación disponible en: http://localhost:${port}/api-docs`);
  });
} 