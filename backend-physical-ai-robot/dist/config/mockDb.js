"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setMockData = exports.getMockData = exports.connectMockDB = void 0;
let mockData = {
    users: [],
    books: [],
    chapters: [],
    content: []
};
const connectMockDB = async () => {
    console.log('Connected to mock database for testing');
};
exports.connectMockDB = connectMockDB;
const getMockData = () => mockData;
exports.getMockData = getMockData;
const setMockData = (data) => {
    mockData = data;
};
exports.setMockData = setMockData;
//# sourceMappingURL=mockDb.js.map