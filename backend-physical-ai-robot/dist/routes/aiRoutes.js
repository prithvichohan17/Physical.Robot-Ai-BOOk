"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiProcessingService_1 = require("../services/aiProcessingService");
const robotController_1 = require("../controllers/robotController");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const router = (0, express_1.Router)();
class BookKnowledgeService {
    constructor() {
        this.bookContent = new Map();
        this.loadBookContent();
    }
    loadBookContent() {
        try {
            const bookPath = path.join(__dirname, '..', '..', '..', 'book', 'book-site', 'docs');
            this.readBookDirectory(bookPath);
            console.log(`Loaded ${this.bookContent.size} book sections`);
        }
        catch (error) {
            console.error('Error loading book content:', error);
        }
    }
    readBookDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                this.readBookDirectory(fullPath);
            }
            else if (item.endsWith('.md') || item.endsWith('.mdx')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const sectionName = path.relative(path.join(__dirname, '..', '..', '..', 'book', 'book-site', 'docs'), fullPath).replace(/\\/g, '/');
                    this.bookContent.set(sectionName, content);
                }
                catch (error) {
                    console.error(`Error reading file ${fullPath}:`, error);
                }
            }
        }
    }
    searchContent(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        for (const [section, content] of this.bookContent.entries()) {
            if (section.toLowerCase().includes(lowerQuery) ||
                content.toLowerCase().includes(lowerQuery)) {
                const truncatedContent = this.truncateContent(content, query);
                results.push(`${section}:\n${truncatedContent}`);
            }
        }
        return results.slice(0, 5);
    }
    truncateContent(content, query) {
        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const queryIndex = lowerContent.indexOf(lowerQuery);
        if (queryIndex === -1) {
            return content.length > 500 ? content.substring(0, 500) + '...' : content;
        }
        let startIndex = Math.max(0, queryIndex - 100);
        const sentenceStart = content.lastIndexOf('.', startIndex);
        if (sentenceStart !== -1 && sentenceStart > queryIndex - 150) {
            startIndex = sentenceStart + 1;
        }
        let endIndex = Math.min(content.length, queryIndex + query.length + 200);
        const sentenceEnd = content.indexOf('.', endIndex);
        if (sentenceEnd !== -1 && sentenceEnd < queryIndex + query.length + 250) {
            endIndex = sentenceEnd + 1;
        }
        const truncated = content.substring(startIndex, endIndex).trim();
        return truncated.length > 1000 ? truncated.substring(0, 1000) + '...' : truncated;
    }
}
const bookService = new BookKnowledgeService();
const aiService = new aiProcessingService_1.AIProcessingService(process.env.GEMINI_API_KEY || '');
router.post('/process-command', async (req, res) => {
    try {
        const { userInput } = req.body;
        if (!userInput || typeof userInput !== 'string') {
            res.status(400).json({
                message: 'Invalid input. Expected a string for userInput.'
            });
            return;
        }
        const robotContext = robotController_1.RobotActions.getStatus();
        const bookResults = bookService.searchContent(userInput);
        const context = bookResults.length > 0
            ? `Based on the Physical AI Robot Book:\n${bookResults.join('\n\n')}\n\nCurrent robot state:
      - Status: ${robotContext.status}
      - Position: (${robotContext.position.x}, ${robotContext.position.y}, ${robotContext.position.z})
      - Orientation: (roll=${robotContext.orientation.roll}, pitch=${robotContext.orientation.pitch}, yaw=${robotContext.orientation.yaw})
      - Battery: ${robotContext.batteryLevel}%
      - Connected: ${robotContext.connected}

      User instruction: "${userInput}"

      Respond with a clear plan of action that the robot should take based on the user's request and book knowledge.
      If the request requires physical action, respond in the format "ACTION: {actionType: 'move', params: {...}}" where actionType is one of: move, rotate, grab, speak, take_photo.`
            : `Current robot state:
      - Status: ${robotContext.status}
      - Position: (${robotContext.position.x}, ${robotContext.position.y}, ${robotContext.position.z})
      - Orientation: (roll=${robotContext.orientation.roll}, pitch=${robotContext.orientation.pitch}, yaw=${robotContext.orientation.yaw})
      - Battery: ${robotContext.batteryLevel}%
      - Connected: ${robotContext.connected}

      User instruction: "${userInput}"

      Respond with a clear plan of action that the robot should take based on the user's request.
      If the request requires physical action, respond in the format "ACTION: {actionType: 'move', params: {...}}" where actionType is one of: move, rotate, grab, speak, take_photo.`;
        const response = await aiService.processCommand(context, robotContext);
        res.status(200).json({
            message: response,
            originalInput: userInput,
            bookReferences: bookResults.length > 0 ? bookResults : null
        });
    }
    catch (error) {
        console.error('Error processing command:', error);
        res.status(500).json({
            message: 'Error processing command',
            error: error.message
        });
    }
});
router.post('/speak', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            res.status(400).json({
                message: 'Invalid input. Expected a string for text.'
            });
            return;
        }
        robotController_1.RobotActions.speak(text);
        res.status(200).json({
            message: 'Speech command sent',
            text
        });
    }
    catch (error) {
        console.error('Error sending speech command:', error);
        res.status(500).json({
            message: 'Error sending speech command',
            error: error.message
        });
    }
});
router.post('/chat', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question || typeof question !== 'string') {
            res.status(400).json({
                message: 'Invalid input. Expected a string for question.'
            });
            return;
        }
        const robotState = robotController_1.RobotActions.getStatus();
        const context = `You are an AI assistant with expertise in physical AI robotics from the "Physical AI Robot Book". The user has asked:

      "${question}"

      Current robot state:
      - Status: ${robotState.status}
      - Position: (${robotState.position.x}, ${robotState.position.y}, ${robotState.position.z})
      - Orientation: (roll=${robotState.orientation.roll}, pitch=${robotState.orientation.pitch}, yaw=${robotState.orientation.yaw})
      - Battery: ${robotState.batteryLevel}%
      - Connected: ${robotState.connected}

      Provide a helpful response to the user's question. Keep your responses concise and informative.
    `;
        const aiResponse = await aiService.processCommand(context, robotState);
        res.status(200).json({
            response: aiResponse,
            question
        });
    }
    catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({
            message: 'Error processing your request',
            error: error.message
        });
    }
});
router.post('/ask-book-question', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question || typeof question !== 'string') {
            res.status(400).json({
                message: 'Invalid input. Expected a string for question.'
            });
            return;
        }
        const bookResults = bookService.searchContent(question);
        const robotState = robotController_1.RobotActions.getStatus();
        if (bookResults.length === 0) {
            res.status(200).json({
                answer: 'I couldn\'t find specific information about this topic in the Physical AI Robot Book.',
                question,
                bookReferences: null
            });
            return;
        }
        const context = `You are an AI assistant with expertise in physical AI robotics from the "Physical AI Robot Book". The user has asked:

      "${question}"

      Based on the book content:
      ${bookResults.join('\n\n')}

      Current robot state:
      - Status: ${robotState.status}
      - Position: (${robotState.position.x}, ${robotState.position.y}, ${robotState.position.z})
      - Orientation: (roll=${robotState.orientation.roll}, pitch=${robotState.orientation.pitch}, yaw=${robotState.orientation.yaw})
      - Battery: ${robotState.batteryLevel}%
      - Connected: ${robotState.connected}

      Provide a helpful response to the user's question based on the book content. If applicable, suggest how the concepts relate to physical robot implementation.
    `;
        const aiResponse = await aiService.processCommand(context, robotState);
        res.status(200).json({
            answer: aiResponse,
            question,
            bookReferences: bookResults
        });
    }
    catch (error) {
        console.error('Error processing book question:', error);
        res.status(500).json({
            message: 'Error processing your question',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=aiRoutes.js.map