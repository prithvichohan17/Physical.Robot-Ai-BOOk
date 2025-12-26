"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Physical AI Robot Backend API is running!' });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route not found',
        availableRoutes: [
            'GET /',
            'GET /api/robot/status',
            'POST /api/robot/move',
            'POST /api/robot/rotate',
            'POST /api/robot/grab',
            'POST /api/robot/speak',
            'POST /api/robot/photo',
            'GET /api/robot/sensors',
            'POST /api/ai/process-command',
            'POST /api/ai/ask-book-question',
            'POST /api/ai/speak',
            'POST /api/book-knowledge/ask',
            'GET /api/book-knowledge/topics',
            'POST /api/book-knowledge/control-with-knowledge'
        ],
        requestedPath: req.path,
        method: req.method
    });
});
console.log('Starting server without MongoDB connection');
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map