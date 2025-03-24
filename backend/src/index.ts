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
  customSiteTitle: 'Atom TODO API - Documentation',
}));

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString() 
  });
});

// Initialize Firebase only once
let firebaseInitialized = false;
try {
  if (!firebaseInitialized) {
    initializeFirebase();
    firebaseInitialized = true;
    console.log('Firebase successfully initialized in environment:', process.env.NODE_ENV);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Configure routes based on Firebase state
if (firebaseInitialized) {
  app.use('/auth', userRouter);
  app.use('/tasks', taskRouter);
} else {
  app.use('/*', (req, res) => {
    res.status(503).json({
      error: 'Service unavailable',
      message: 'Error initializing Firebase'
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

// Global error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Export the function for Firebase Functions
export const api = functions.https.onRequest(app);

// Start the local server if we are not in Firebase Functions or deployment
if (!process.env.FUNCTION_TARGET && !process.env.FIREBASE_CONFIG) {
  app.listen(port, () => {
    console.log(`Server started on port ${port} in ${process.env.NODE_ENV} mode`);
    console.log(`Firebase status: ${firebaseInitialized ? 'Initialized' : 'Not initialized'}`);
    console.log(`Documentation available at: http://localhost:${port}/api-docs`);
  });
} 