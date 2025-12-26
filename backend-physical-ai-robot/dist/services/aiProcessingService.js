"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIProcessingService = void 0;
const axios_1 = __importDefault(require("axios"));
const robotController_1 = require("../controllers/robotController");
class AIProcessingService {
    constructor(apiKey) {
        this.geminiApiKey = apiKey;
        this.geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`;
    }
    async processCommand(userInput, robotContext) {
        try {
            const context = `
        You are an AI assistant controlling a physical robot. The robot has the following capabilities:
        - Movement: Move to coordinates (x, y, z)
        - Rotation: Rotate to specific angles (roll, pitch, yaw)
        - Manipulation: Control grabbers (left, right)
        - Communication: Speak text
        - Sensors: Access to temperature, humidity, proximity, and light sensors
        - Camera: Take photos

        Current robot state:
        - Status: ${robotContext.status}
        - Position: (${robotContext.position.x}, ${robotContext.position.y}, ${robotContext.position.z})
        - Orientation: (roll=${robotContext.orientation.roll}, pitch=${robotContext.orientation.pitch}, yaw=${robotContext.orientation.yaw})
        - Battery: ${robotContext.batteryLevel}%
        - Connected: ${robotContext.connected}

        User instruction: "${userInput}"

        Respond with a clear plan of action that the robot should take based on the user's request.
        If the request requires physical action, respond in the format "ACTION: {actionType: 'move', params: {...}}" where actionType is one of: move, rotate, grab, speak, take_photo, sensor_read.
        For general conversation, respond as a helpful assistant.
      `;
            const requestBody = {
                contents: [{
                        parts: [{
                                text: context
                            }]
                    }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                    topK: 40,
                    topP: 0.95
                }
            };
            const response = await axios_1.default.post(this.geminiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data.candidates || response.data.candidates.length === 0) {
                return 'Sorry, I could not generate a response. Please try again.';
            }
            const aiResponse = response.data.candidates[0].content.parts[0].text.trim();
            if (aiResponse.startsWith('ACTION:')) {
                const actionStr = aiResponse.substring(7).trim();
                try {
                    const actionObj = JSON.parse(actionStr);
                    await this.executeAction(actionObj);
                    return `I've executed your request: ${actionObj.actionType} with params ${JSON.stringify(actionObj.params)}.`;
                }
                catch (e) {
                    console.error('Error parsing AI action:', e);
                    return 'I understood your request, but had trouble executing the action.';
                }
            }
            return aiResponse;
        }
        catch (error) {
            console.error('AI Processing Error:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
                console.error('Response headers:', error.response?.headers);
            }
            return 'Sorry, I encountered an issue processing your request. Could you try rephrasing?';
        }
    }
    async executeAction(action) {
        switch (action.actionType) {
            case 'move':
                const { x, y, z } = action.params;
                if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
                    robotController_1.RobotActions.move(x, y, z);
                }
                break;
            case 'rotate':
                const { roll, pitch, yaw } = action.params;
                if (typeof roll === 'number' && typeof pitch === 'number' && typeof yaw === 'number') {
                    robotController_1.RobotActions.rotate(roll, pitch, yaw);
                }
                break;
            case 'grab':
                const { left, right } = action.params;
                if (typeof left === 'boolean' && typeof right === 'boolean') {
                    robotController_1.RobotActions.grab(left, right);
                }
                break;
            case 'speak':
                const { text } = action.params;
                if (typeof text === 'string') {
                    robotController_1.RobotActions.speak(text);
                }
                break;
            case 'take_photo':
                robotController_1.RobotActions.takePhoto();
                break;
            case 'sensor_read':
                break;
            default:
                console.warn('Unknown action type:', action.actionType);
        }
    }
}
exports.AIProcessingService = AIProcessingService;
//# sourceMappingURL=aiProcessingService.js.map