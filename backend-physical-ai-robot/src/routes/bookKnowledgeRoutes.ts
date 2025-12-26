import { Router } from 'express';
import { 
  askBookQuestion, 
  getBookTopics, 
  controlRobotWithBookKnowledge 
} from '../controllers/bookKnowledgeController';

const router = Router();

// Book knowledge and Q&A routes
router.post('/ask', askBookQuestion);
router.get('/topics', getBookTopics);
router.post('/control-with-knowledge', controlRobotWithBookKnowledge);

export default router;