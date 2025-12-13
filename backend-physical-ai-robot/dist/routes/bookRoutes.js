"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("../controllers/bookController");
const router = (0, express_1.Router)();
router.route('/')
    .get(bookController_1.getBooks)
    .post(bookController_1.createBook);
router.route('/:id')
    .get(bookController_1.getBookById)
    .put(bookController_1.updateBook)
    .delete(bookController_1.deleteBook);
exports.default = router;
//# sourceMappingURL=bookRoutes.js.map