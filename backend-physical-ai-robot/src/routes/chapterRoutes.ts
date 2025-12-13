import { Router } from 'express';
import {
  getChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter
} from '../controllers/chapterController';

const router = Router();

router.route('/')
  .get(getChapters)
  .post(createChapter);

router.route('/:id')
  .get(getChapterById)
  .put(updateChapter)
  .delete(deleteChapter);

export default router;