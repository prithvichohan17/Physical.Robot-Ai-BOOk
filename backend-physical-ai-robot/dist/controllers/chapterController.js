"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChapter = exports.updateChapter = exports.createChapter = exports.getChapterById = exports.getChapters = void 0;
const database_1 = require("../config/database");
const getChapters = (req, res) => {
    try {
        const chapters = database_1.dataStore.chapters;
        return res.status(200).json({
            success: true,
            count: chapters.length,
            data: chapters
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getChapters = getChapters;
const getChapterById = (req, res) => {
    try {
        const chapter = database_1.dataStore.chapters.find((c) => c._id === req.params.id);
        if (!chapter) {
            return res.status(404).json({ message: `No chapter with id of ${req.params.id}` });
        }
        return res.status(200).json({
            success: true,
            data: chapter
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getChapterById = getChapterById;
const createChapter = (req, res) => {
    try {
        const { title, book, content, number, description } = req.body;
        const chapter = {
            _id: Date.now().toString(),
            title,
            book,
            content,
            number,
            description,
            published: false,
            publishedAt: null,
            views: 0,
            likes: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        database_1.dataStore.chapters.push(chapter);
        const bookToUpdate = database_1.dataStore.books.find((b) => b._id === book);
        if (bookToUpdate) {
            bookToUpdate.chapters.push(chapter._id);
        }
        return res.status(201).json({
            success: true,
            data: chapter
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.createChapter = createChapter;
const updateChapter = (req, res) => {
    try {
        const chapter = database_1.dataStore.chapters.find((c) => c._id === req.params.id);
        if (!chapter) {
            return res.status(404).json({ message: `No chapter with id of ${req.params.id}` });
        }
        Object.assign(chapter, req.body, { updatedAt: new Date() });
        return res.status(200).json({
            success: true,
            data: chapter
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.updateChapter = updateChapter;
const deleteChapter = (req, res) => {
    try {
        const chapterIndex = database_1.dataStore.chapters.findIndex((c) => c._id === req.params.id);
        if (chapterIndex === -1) {
            return res.status(404).json({ message: `No chapter with id of ${req.params.id}` });
        }
        const chapter = database_1.dataStore.chapters[chapterIndex];
        database_1.dataStore.chapters.splice(chapterIndex, 1);
        const bookToUpdate = database_1.dataStore.books.find((b) => b._id === chapter.book);
        if (bookToUpdate) {
            bookToUpdate.chapters = bookToUpdate.chapters.filter((id) => id !== chapter._id);
        }
        return res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteChapter = deleteChapter;
//# sourceMappingURL=chapterController.js.map