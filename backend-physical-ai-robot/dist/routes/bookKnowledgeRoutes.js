"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookKnowledgeController_1 = require("../controllers/bookKnowledgeController");
const router = (0, express_1.Router)();
router.post('/ask', bookKnowledgeController_1.askBookQuestion);
router.get('/topics', bookKnowledgeController_1.getBookTopics);
router.post('/control-with-knowledge', bookKnowledgeController_1.controlRobotWithBookKnowledge);
exports.default = router;
//# sourceMappingURL=bookKnowledgeRoutes.js.map