"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController_1 = require("../controllers/contentController");
const router = (0, express_1.Router)();
router.route('/')
    .get(contentController_1.getContent)
    .post(contentController_1.createContent);
router.route('/:id')
    .get(contentController_1.getContentById)
    .put(contentController_1.updateContent)
    .delete(contentController_1.deleteContent);
exports.default = router;
//# sourceMappingURL=contentRoutes.js.map