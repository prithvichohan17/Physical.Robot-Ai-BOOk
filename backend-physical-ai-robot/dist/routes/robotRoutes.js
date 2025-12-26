"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const robotController_1 = require("../controllers/robotController");
const router = (0, express_1.Router)();
router.get('/status', robotController_1.getRobotStatus);
router.post('/move', robotController_1.moveRobot);
router.post('/rotate', robotController_1.rotateRobot);
router.post('/grab', robotController_1.grabObject);
router.post('/speak', robotController_1.speakText);
router.post('/photo', robotController_1.takePhoto);
router.get('/sensors', robotController_1.getSensorData);
exports.default = router;
//# sourceMappingURL=robotRoutes.js.map