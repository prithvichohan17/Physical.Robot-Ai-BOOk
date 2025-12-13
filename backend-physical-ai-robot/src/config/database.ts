// src/config/database.ts - Simple in-memory database for development
export interface IDataStore {
  users: any[];
  books: any[];
  chapters: any[];
  content: any[];
}

// In-memory data store
export const dataStore: IDataStore = {
  users: [],
  books: [],
  chapters: [],
  content: []
};

// Function to reset data store (useful for testing)
export const resetDataStore = (): void => {
  dataStore.users = [];
  dataStore.books = [];
  dataStore.chapters = [];
  dataStore.content = [];
};

console.log('In-memory database initialized for development');