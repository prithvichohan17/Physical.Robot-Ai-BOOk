import { Router } from 'express';
import {
  getContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent
} from '../controllers/contentController';

const router = Router();

router.route('/')
  .get(getContent)
  .post(createContent);

router.route('/:id')
  .get(getContentById)
  .put(updateContent)
  .delete(deleteContent);

export default router;