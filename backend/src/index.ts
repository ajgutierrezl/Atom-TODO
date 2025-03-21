import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes';
import taskRouter from './routes/task.routes';

// Cargar variables de entorno
dotenv.config();

// Crear app Express
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req: Request, _: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// Ruta para verificar si la API está funcionando
app.get('/api/health', (_: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

// Manejador de rutas no encontradas
app.use((_: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}); 