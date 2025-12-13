"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookRoutes_1 = __importDefault(require("./bookRoutes"));
const chapterRoutes_1 = __importDefault(require("./chapterRoutes"));
const contentRoutes_1 = __importDefault(require("./contentRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/books', bookRoutes_1.default);
router.use('/chapters', chapterRoutes_1.default);
router.use('/content', contentRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map