import { Router } from 'express';
import bookRoutes from './bookRoutes';
import chapterRoutes from './chapterRoutes';
import contentRoutes from './contentRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Define routes
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/chapters', chapterRoutes);
router.use('/content', contentRoutes);

export default router;