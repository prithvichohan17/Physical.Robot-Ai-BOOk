import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api', routes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Physical AI Robot Backend API is running!' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /api/robot/status',
      'POST /api/robot/move',
      'POST /api/robot/rotate',
      'POST /api/robot/grab',
      'POST /api/robot/speak',
      'POST /api/robot/photo',
      'GET /api/robot/sensors',
      'POST /api/ai/process-command',
      'POST /api/ai/ask-book-question',
      'POST /api/ai/speak',
      'POST /api/book-knowledge/ask',
      'GET /api/book-knowledge/topics',
      'POST /api/book-knowledge/control-with-knowledge'
    ],
    requestedPath: req.path,
    method: req.method
  });
});

// For development without MongoDB
console.log('Starting server without MongoDB connection');

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
  } else {
    console.error('Server error:', error);
  }
});

export default app;