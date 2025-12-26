import { Router } from 'express';
import bookRoutes from './bookRoutes';
import chapterRoutes from './chapterRoutes';
import contentRoutes from './contentRoutes';
import authRoutes from './authRoutes';
import robotRoutes from './robotRoutes';
import aiRoutes from './aiRoutes';
import bookKnowledgeRoutes from './bookKnowledgeRoutes';

const router = Router();

// Define routes
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/chapters', chapterRoutes);
router.use('/content', contentRoutes);
router.use('/robot', robotRoutes);
router.use('/ai', aiRoutes);
router.use('/book-knowledge', bookKnowledgeRoutes);

export default router;