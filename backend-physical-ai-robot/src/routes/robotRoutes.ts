import { Router } from 'express';
import { 
  getRobotStatus, 
  moveRobot, 
  rotateRobot, 
  grabObject, 
  speakText, 
  takePhoto, 
  getSensorData 
} from '../controllers/robotController';

const router = Router();

// Robot status and control routes
router.get('/status', getRobotStatus);
router.post('/move', moveRobot);
router.post('/rotate', rotateRobot);
router.post('/grab', grabObject);
router.post('/speak', speakText);
router.post('/photo', takePhoto);
router.get('/sensors', getSensorData);

export default router;