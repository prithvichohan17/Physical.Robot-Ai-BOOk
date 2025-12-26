import { Request, Response } from 'express';
import { AIProcessingService } from '../services/aiProcessingService';
import { RobotActions } from '../controllers/robotController';
import * as fs from 'fs';
import * as path from 'path';

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
  
  public getAllTopics(): string[] {
    const topics: string[] = [];
    
    for (const [section] of this.bookContent.entries()) {
      topics.push(section);
    }
    
    return topics;
  }
}

const bookService = new BookKnowledgeService();
const aiService = new AIProcessingService(process.env.GEMINI_API_KEY || '');

export const askBookQuestion = async (req: Request, res: Response): Promise<void> => {
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

    // Prepare context for AI with book knowledge
    const bookContext = bookResults.length > 0
      ? `Based on the Physical AI Robot Book:\n${bookResults.join('\n\n')}`
      : 'I couldn\'t find specific information about this topic in the Physical AI Robot Book, but I can provide general assistance.';

    // Get current robot state for additional context
    const robotState = RobotActions.getStatus();

    // Prepare context for the AI
    const context = `
      You are an AI assistant with expertise in physical AI robotics. You have access to the content
      from the "Physical AI Robot Book". The user has asked:

      "${question}"

      ${bookContext}

      Current robot state:
      - Status: ${robotState.status}
      - Position: (${robotState.position.x}, ${robotState.position.y}, ${robotState.position.z})
      - Orientation: (roll=${robotState.orientation.roll}, pitch=${robotState.orientation.pitch}, yaw=${robotState.orientation.yaw})
      - Battery: ${robotState.batteryLevel}%
      - Connected: ${robotState.connected}

      Provide a helpful response to the user's question based on the book content. If the question involves
      controlling the robot physically, suggest possible actions that could be taken. If the user wants
      to know about specific book chapters or content, reference the relevant sections.
    `;

    const aiResponse = await aiService.processCommand(context, robotState);

    res.status(200).json({
      answer: aiResponse,
      question,
      bookReferences: bookResults.length > 0 ? bookResults : null
    });
  } catch (error) {
    console.error('Error processing book question:', error);
    res.status(500).json({
      message: 'Error processing your question',
      error: (error as Error).message
    });
  }
};

export const getBookTopics = (req: Request, res: Response): void => {
  try {
    const topics = bookService.getAllTopics();
    res.status(200).json({ topics, count: topics.length });
  } catch (error) {
    console.error('Error getting book topics:', error);
    res.status(500).json({
      message: 'Error retrieving book topics',
      error: (error as Error).message
    });
  }
};

export const controlRobotWithBookKnowledge = async (req: Request, res: Response): Promise<void> => {
  try {
    const { command } = req.body;

    if (!command || typeof command !== 'string') {
      res.status(400).json({
        message: 'Invalid input. Expected a string for command.'
      });
      return;
    }

    // Search book content for robot control techniques
    const bookResults = bookService.searchContent(command);

    // Get current robot state
    const robotState = RobotActions.getStatus();

    // Prepare context for the AI combining book knowledge with robot control
    const context = `
      You are controlling a physical robot based on information from the Physical AI Robot Book.

      User command: "${command}"

      Relevant book content: ${bookResults.length > 0
        ? bookResults.join('\n')
        : 'No direct book references found. Apply general robotics principles.'}

      Current robot state:
      - Status: ${robotState.status}
      - Position: (${robotState.position.x}, ${robotState.position.y}, ${robotState.position.z})
      - Orientation: (roll=${robotState.orientation.roll}, pitch=${robotState.orientation.pitch}, yaw=${robotState.orientation.yaw})
      - Battery: ${robotState.batteryLevel}%
      - Connected: ${robotState.connected}

      If the command requires physical action, respond in the format "ACTION: {actionType: 'move', params: {...}}" where actionType is one of: move, rotate, grab, speak, take_photo.
      Also provide an explanation from the book about why this action is appropriate.
    `;

    const aiResponse = await aiService.processCommand(context, robotState);

    res.status(200).json({
      response: aiResponse,
      command,
      bookReferences: bookResults.length > 0 ? bookResults : null
    });
  } catch (error) {
    console.error('Error controlling robot with book knowledge:', error);
    res.status(500).json({
      message: 'Error processing robot control command',
      error: (error as Error).message
    });
  }
};