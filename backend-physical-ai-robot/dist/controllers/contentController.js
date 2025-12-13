"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.createContent = exports.getContentById = exports.getContent = void 0;
const database_1 = require("../config/database");
const getContent = (req, res) => {
    try {
        const contentItems = database_1.dataStore.content;
        return res.status(200).json({
            success: true,
            count: contentItems.length,
            data: contentItems
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getContent = getContent;
const getContentById = (req, res) => {
    try {
        const contentItem = database_1.dataStore.content.find((c) => c._id === req.params.id);
        if (!contentItem) {
            return res.status(404).json({ message: `No content with id of ${req.params.id}` });
        }
        return res.status(200).json({
            success: true,
            data: contentItem
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.getContentById = getContentById;
const createContent = (req, res) => {
    try {
        const { chapter, type, content, order, metadata } = req.body;
        const contentItem = {
            _id: Date.now().toString(),
            chapter,
            type,
            content,
            order,
            metadata,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        database_1.dataStore.content.push(contentItem);
        return res.status(201).json({
            success: true,
            data: contentItem
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.createContent = createContent;
const updateContent = (req, res) => {
    try {
        const contentItem = database_1.dataStore.content.find((c) => c._id === req.params.id);
        if (!contentItem) {
            return res.status(404).json({ message: `No content with id of ${req.params.id}` });
        }
        Object.assign(contentItem, req.body, { updatedAt: new Date() });
        return res.status(200).json({
            success: true,
            data: contentItem
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.updateContent = updateContent;
const deleteContent = (req, res) => {
    try {
        const contentIndex = database_1.dataStore.content.findIndex((c) => c._id === req.params.id);
        if (contentIndex === -1) {
            return res.status(404).json({ message: `No content with id of ${req.params.id}` });
        }
        database_1.dataStore.content.splice(contentIndex, 1);
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
exports.deleteContent = deleteContent;
//# sourceMappingURL=contentController.js.map