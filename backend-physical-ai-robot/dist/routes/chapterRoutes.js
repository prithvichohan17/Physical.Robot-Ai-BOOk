"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapterController_1 = require("../controllers/chapterController");
const router = (0, express_1.Router)();
router.route('/')
    .get(chapterController_1.getChapters)
    .post(chapterController_1.createChapter);
router.route('/:id')
    .get(chapterController_1.getChapterById)
    .put(chapterController_1.updateChapter)
    .delete(chapterController_1.deleteChapter);
exports.default = router;
//# sourceMappingURL=chapterRoutes.js.map