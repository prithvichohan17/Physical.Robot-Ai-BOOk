// Mock database implementation for testing without MongoDB

// In-memory storage for testing
let mockData: any = {
  users: [],
  books: [],
  chapters: [],
  content: []
};

export const connectMockDB = async (): Promise<void> => {
  console.log('Connected to mock database for testing');
  // Mock implementation for testing purposes
};

export const getMockData = () => mockData;

export const setMockData = (data: any) => {
  mockData = data;
};