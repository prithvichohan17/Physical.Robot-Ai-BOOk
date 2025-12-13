// Book Controller using in-memory database
import { Request, Response } from 'express';
import { dataStore } from '../config/database';

export const getBooks = (req: Request, res: Response) => {
  try {
    const books = dataStore.books;
    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getBookById = (req: Request, res: Response) => {
  try {
    const book = dataStore.books.find((b: any) => b._id === req.params.id);

    if (!book) {
      return res.status(404).json({ message: `No book with id of ${req.params.id}` });
    }

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createBook = (req: Request, res: Response) => {
  try {
    const { title, subtitle, author, description, coverImage, category, tags } = req.body;

    // Create book
    const book = {
      _id: Date.now().toString(), // Simple ID generation for dev
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

    dataStore.books.push(book);

    return res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateBook = (req: Request, res: Response) => {
  try {
    const book = dataStore.books.find((b: any) => b._id === req.params.id);

    if (!book) {
      return res.status(404).json({ message: `No book with id of ${req.params.id}` });
    }

    // Update book
    Object.assign(book, req.body, { updatedAt: new Date() });

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBook = (req: Request, res: Response) => {
  try {
    const bookIndex = dataStore.books.findIndex((b: any) => b._id === req.params.id);

    if (bookIndex === -1) {
      return res.status(404).json({ message: `No book with id of ${req.params.id}` });
    }

    // Remove book
    dataStore.books.splice(bookIndex, 1);

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};