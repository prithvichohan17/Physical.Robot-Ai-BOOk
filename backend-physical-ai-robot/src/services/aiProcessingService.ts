import axios from 'axios';
import { RobotActions } from '../controllers/robotController';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class AIProcessingService {
  private geminiApiKey: string;
  private geminiUrl: string;

  constructor(apiKey: string) {
    this.geminiApiKey = apiKey;
    this.geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`;
  }

  async processCommand(userInput: string, robotContext: any): Promise<string> {
    try {
      // Check if API key is available
      if (!this.geminiApiKey || this.geminiApiKey === '') {
        return '⚠️ The AI service is currently busy or has reached its usage limit. Please try again later.';
      }

      // Prepare the context for the AI
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

      const response = await axios.post<GeminiResponse>(this.geminiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.candidates || response.data.candidates.length === 0) {
        return '⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.';
      }

      const aiResponse = response.data.candidates[0].content.parts[0].text.trim();

      // Check if the AI provided an action command
      if (aiResponse.startsWith('ACTION:')) {
        // Extract and execute the action (in a real implementation)
        const actionStr = aiResponse.substring(7).trim(); // Remove "ACTION: "
        try {
          const actionObj = JSON.parse(actionStr);
          await this.executeAction(actionObj);
          return `I've executed your request: ${actionObj.actionType} with params ${JSON.stringify(actionObj.params)}.`;
        } catch (e) {
          console.error('Error parsing AI action:', e);
          return 'I understood your request, but had trouble executing the action.';
        }
      }

      return aiResponse;
    } catch (error) {
      console.error('AI Processing Error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);

        // Check for specific error conditions
        if (error.response?.status === 429) {
          // Rate limit exceeded
          return '⚠️ The AI service is currently busy or has reached its usage limit. Please try again later.';
        } else if (error.response?.status >= 500) {
          // Server error
          return '⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.';
        } else if (error.response?.status === 400 || error.response?.status === 401 || error.response?.status === 403) {
          // Invalid request, unauthorized, or forbidden
          return '⚠️ The AI service is currently busy or has reached its usage limit. Please try again later.';
        }
      }

      // Handle network errors
      if (error.message && (error.message.includes('network') ||
                           error.message.includes('ENOTFOUND') ||
                           error.message.includes('ECONNREFUSED') ||
                           error.message.includes('timeout'))) {
        return '⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.';
      }

      // For other errors, return the standard unavailable message
      return '⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.';
    }
  }

  private async executeAction(action: any): Promise<void> {
    switch (action.actionType) {
      case 'move':
        // Extract movement params
        const { x, y, z } = action.params;
        // Call the robot movement function
        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
          RobotActions.move(x, y, z);
        }
        break;

      case 'rotate':
        const { roll, pitch, yaw } = action.params;
        if (typeof roll === 'number' && typeof pitch === 'number' && typeof yaw === 'number') {
          RobotActions.rotate(roll, pitch, yaw);
        }
        break;

      case 'grab':
        const { left, right } = action.params;
        if (typeof left === 'boolean' && typeof right === 'boolean') {
          RobotActions.grab(left, right);
        }
        break;

      case 'speak':
        const { text } = action.params;
        if (typeof text === 'string') {
          RobotActions.speak(text);
        }
        break;

      case 'take_photo':
        RobotActions.takePhoto();
        break;

      case 'sensor_read':
        // Just returning sensor data, no robot action needed
        break;

      default:
        console.warn('Unknown action type:', action.actionType);
    }
  }
}