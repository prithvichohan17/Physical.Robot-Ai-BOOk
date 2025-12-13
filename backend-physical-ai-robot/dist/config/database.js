"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDataStore = exports.dataStore = void 0;
exports.dataStore = {
    users: [],
    books: [],
    chapters: [],
    content: []
};
const resetDataStore = () => {
    exports.dataStore.users = [];
    exports.dataStore.books = [];
    exports.dataStore.chapters = [];
    exports.dataStore.content = [];
};
exports.resetDataStore = resetDataStore;
console.log('In-memory database initialized for development');
//# sourceMappingURL=database.js.map