// Content Controller using in-memory database
import { Request, Response } from 'express';
import { dataStore } from '../config/database';

export const getContent = (req: Request, res: Response) => {
  try {
    const contentItems = dataStore.content;
    return res.status(200).json({
      success: true,
      count: contentItems.length,
      data: contentItems
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getContentById = (req: Request, res: Response) => {
  try {
    const contentItem = dataStore.content.find((c: any) => c._id === req.params.id);

    if (!contentItem) {
      return res.status(404).json({ message: `No content with id of ${req.params.id}` });
    }

    return res.status(200).json({
      success: true,
      data: contentItem
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createContent = (req: Request, res: Response) => {
  try {
    const { chapter, type, content, order, metadata } = req.body;

    // Create content
    const contentItem = {
      _id: Date.now().toString(), // Simple ID generation for dev
      chapter,
      type,
      content,
      order,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dataStore.content.push(contentItem);

    return res.status(201).json({
      success: true,
      data: contentItem
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateContent = (req: Request, res: Response) => {
  try {
    const contentItem = dataStore.content.find((c: any) => c._id === req.params.id);

    if (!contentItem) {
      return res.status(404).json({ message: `No content with id of ${req.params.id}` });
    }

    // Update content
    Object.assign(contentItem, req.body, { updatedAt: new Date() });

    return res.status(200).json({
      success: true,
      data: contentItem
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteContent = (req: Request, res: Response) => {
  try {
    const contentIndex = dataStore.content.findIndex((c: any) => c._id === req.params.id);

    if (contentIndex === -1) {
      return res.status(404).json({ message: `No content with id of ${req.params.id}` });
    }

    // Remove content
    dataStore.content.splice(contentIndex, 1);

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};