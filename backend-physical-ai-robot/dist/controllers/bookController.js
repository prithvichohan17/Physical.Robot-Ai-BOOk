"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getBooks = void 0;
const database_1 = require("../config/database");
const getBooks = (req, res) => {
    try {
        const books = database_1.dataStore.books;
        return res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getBooks = getBooks;
const getBookById = (req, res) => {
    try {
        const book = database_1.dataStore.books.find((b) => b._id === req.params.id);
        if (!book) {
            return res.status(404).json({ message: `No book with id of ${req.params.id}` });
        }
        return res.status(200).json({
            success: true,
            data: book
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getBookById = getBookById;
const createBook = (req, res) => {
    try {
        const { title, subtitle, author, description, coverImage, category, tags } = req.body;
        const book = {
            _id: Date.now().toString(),
            title,
            subtitle,
            author,
            description,
            coverImage: coverImage || '',
            category,
            tags: tags || [],
            chapters: [],
            published: false,
            publishedAt: null,
            views: 0,
            likes: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        database_1.dataStore.books.push(book);
        return res.status(201).json({
            success: true,
            data: book
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.createBook = createBook;
const updateBook = (req, res) => {
    try {
        const book = database_1.dataStore.books.find((b) => b._id === req.params.id);
        if (!book) {
            return res.status(404).json({ message: `No book with id of ${req.params.id}` });
        }
        Object.assign(book, req.body, { updatedAt: new Date() });
        return res.status(200).json({
            success: true,
            data: book
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBook = updateBook;
const deleteBook = (req, res) => {
    try {
        const bookIndex = database_1.dataStore.books.findIndex((b) => b._id === req.params.id);
        if (bookIndex === -1) {
            return res.status(404).json({ message: `No book with id of ${req.params.id}` });
        }
        database_1.dataStore.books.splice(bookIndex, 1);
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
exports.deleteBook = deleteBook;
//# sourceMappingURL=bookController.js.map