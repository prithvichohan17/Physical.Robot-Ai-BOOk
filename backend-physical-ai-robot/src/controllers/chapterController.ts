// Chapter Controller using in-memory database
import { Request, Response } from 'express';
import { dataStore } from '../config/database';

export const getChapters = (req: Request, res: Response) => {
  try {
    const chapters = dataStore.chapters;
    return res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getChapterById = (req: Request, res: Response) => {
  try {
    const chapter = dataStore.chapters.find((c: any) => c._id === req.params.id);

    if (!chapter) {
      return res.status(404).json({ message: `No chapter with id of ${req.params.id}` });
    }

    return res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createChapter = (req: Request, res: Response) => {
  try {
    const { title, book, content, number, description } = req.body;

    // Create chapter
    const chapter = {
      _id: Date.now().toString(), // Simple ID generation for dev
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

    dataStore.chapters.push(chapter);

    // Add chapter to the book's chapters array
    const bookToUpdate = dataStore.books.find((b: any) => b._id === book);
    if (bookToUpdate) {
      bookToUpdate.chapters.push(chapter._id);
    }

    return res.status(201).json({
      success: true,
      data: chapter
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateChapter = (req: Request, res: Response) => {
  try {
    const chapter = dataStore.chapters.find((c: any) => c._id === req.params.id);

    if (!chapter) {
      return res.status(404).json({ message: `No chapter with id of ${req.params.id}` });
    }

    // Update chapter
    Object.assign(chapter, req.body, { updatedAt: new Date() });

    return res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteChapter = (req: Request, res: Response) => {
  try {
    const chapterIndex = dataStore.chapters.findIndex((c: any) => c._id === req.params.id);

    if (chapterIndex === -1) {
      return res.status(404).json({ message: `No chapter with id of ${req.params.id}` });
    }

    // Remove chapter
    const chapter = dataStore.chapters[chapterIndex];
    dataStore.chapters.splice(chapterIndex, 1);

    // Remove chapter reference from the book
    const bookToUpdate = dataStore.books.find((b: any) => b._id === chapter.book);
    if (bookToUpdate) {
      bookToUpdate.chapters = bookToUpdate.chapters.filter((id: string) => id !== chapter._id);
    }

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};