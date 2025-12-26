import { Router } from 'express';
import { Request, Response } from 'express';
import { AIProcessingService } from '../services/aiProcessingService';
import { RobotActions } from '../controllers/robotController';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// Service to handle book content queries
class BookKnowledgeService {
  private bookContent: Map<string, string> = new Map();

  constructor() {
    this.loadBookContent();
  }

  private loadBookContent(): void {
    try {
      // Path to your book content
      const bookPath = path.join(__dirname, '..', '..', '..', 'book', 'book-site', 'docs');

      // Read all markdown files in the book directory
      this.readBookDirectory(bookPath);

      console.log(`Loaded ${this.bookContent.size} book sections`);
    } catch (error) {
      console.error('Error loading book content:', error);
    }
  }

  private readBookDirectory(dirPath: string): void {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.readBookDirectory(fullPath); // Recursively read subdirectories
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const sectionName = path.relative(
            path.join(__dirname, '..', '..', '..', 'book', 'book-site', 'docs'),
            fullPath
          ).replace(/\\/g, '/');

          this.bookContent.set(sectionName, content);
        } catch (error) {
          console.error(`Error reading file ${fullPath}:`, error);
        }
      }
    }
  }

  public searchContent(query: string): string[] {
    const results: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [section, content] of this.bookContent.entries()) {
      // Search for the query in the content (case-insensitive)
      if (
        section.toLowerCase().includes(lowerQuery) ||
        content.toLowerCase().includes(lowerQuery)
      ) {
        // Truncate content to relevant sections
        const truncatedContent = this.truncateContent(content, query);
        results.push(`${section}:\n${truncatedContent}`);
      }
    }

    return results.slice(0, 5); // Return top 5 results
  }

  private truncateContent(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const queryIndex = lowerContent.indexOf(lowerQuery);

    if (queryIndex === -1) {
      // If query not found in content, return first 500 chars
      return content.length > 500 ? content.substring(0, 500) + '...' : content;
    }

    // Find a reasonable start point (beginning of sentence)
    let startIndex = Math.max(0, queryIndex - 100);
    const sentenceStart = content.lastIndexOf('.', startIndex);
    if (sentenceStart !== -1 && sentenceStart > queryIndex - 150) {
      startIndex = sentenceStart + 1;
    }

    // Find a reasonable end point (end of sentence)
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
const aiService = new AIProcessingService(process.env.GEMINI_API_KEY || '');

router.post('/process-command', async (req: Request, res: Response) => {
  try {
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      res.status(400).json({
        message: 'Invalid input. Expected a string for userInput.'
      });
      return;
    }

    // Get current robot state for context
    const robotContext = RobotActions.getStatus();

    // Search book content for relevant information
    const bookResults = bookService.searchContent(userInput);

    // Prepare context for the AI
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

    // Process the command through AI
    const response = await aiService.processCommand(context, robotContext);

    // Check if response indicates an error condition
    if (response.includes('⚠️')) {
      // This indicates an error response from the AI service
      return res.status(503).json({
        message: response,
        originalInput: userInput,
        bookReferences: bookResults.length > 0 ? bookResults : null
      });
    }

    res.status(200).json({
      message: response,
      originalInput: userInput,
      bookReferences: bookResults.length > 0 ? bookResults : null
    });
  } catch (error) {
    console.error('Error processing command:', error);
    res.status(503).json({
      message: "⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.",
      error: (error as Error).message
    });
  }
});

// Simple text-to-speech endpoint
router.post('/speak', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({
        message: 'Invalid input. Expected a string for text.'
      });
      return;
    }

    // Make the robot speak the text
    RobotActions.speak(text);

    res.status(200).json({
      message: 'Speech command sent',
      text
    });
  } catch (error) {
    console.error('Error sending speech command:', error);
    res.status(500).json({
      message: 'Error sending speech command',
      error: (error as Error).message
    });
  }
});

// Simple chat endpoint for the frontend widget
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({
        message: 'Invalid input. Expected a string for question.'
      });
      return;
    }

    // Get current robot state for additional context
    const robotState = RobotActions.getStatus();

    // Prepare context for the AI with book knowledge
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

    // Check if response indicates an error condition
    if (aiResponse.includes('⚠️')) {
      // This indicates an error response from the AI service
      return res.status(503).json({
        response: aiResponse,
        question
      });
    }

    res.status(200).json({
      response: aiResponse,
      question
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(503).json({
      message: "⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.",
      error: (error as Error).message
    });
  }
});

// Endpoint to ask questions about the book content
router.post('/ask-book-question', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({
        message: 'Invalid input. Expected a string for question.'
      });
      return;
    }

    // Search book content for relevant information
    const bookResults = bookService.searchContent(question);

    // Get current robot state for additional context
    const robotState = RobotActions.getStatus();

    if (bookResults.length === 0) {
      res.status(200).json({
        answer: 'I couldn\'t find specific information about this topic in the Physical AI Robot Book.',
        question,
        bookReferences: null
      });
      return;
    }

    // Prepare context for the AI with book knowledge
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

    // Check if response indicates an error condition
    if (aiResponse.includes('⚠️')) {
      // This indicates an error response from the AI service
      return res.status(503).json({
        answer: aiResponse,
        question,
        bookReferences: bookResults
      });
    }

    res.status(200).json({
      answer: aiResponse,
      question,
      bookReferences: bookResults
    });
  } catch (error) {
    console.error('Error processing book question:', error);
    res.status(503).json({
      message: "⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting.",
      error: (error as Error).message
    });
  }
});

export default router;