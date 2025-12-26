// Book Site AI Assistant - Integrates Docusaurus book site with AI capabilities
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const GeminiService = require('./ai-chatbot/gemini-service');

class BookSiteAIAssistant {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.geminiService = null;
    this.bookContent = '';
    
    this.init();
  }

  async init() {
    // Middleware
    this.app.use(cors());
    this.app.use(express.json());
    
    // Serve static files from book-site
    this.app.use('/book', express.static(path.join(__dirname, 'book', 'book-site', 'build')));
    
    // Serve static files from ai-chatbot
    this.app.use(express.static(path.join(__dirname, 'ai-chatbot')));

    // Initialize services
    await this.initializeServices();
    
    // Setup routes
    this.setupRoutes();
    
    // Start server
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`🚀 Book Site AI Assistant Server is running on http://localhost:${this.port}`);
      console.log(`📚 Book site available at http://localhost:${this.port}/book`);
      console.log(`💬 AI Chat interface available at http://localhost:${this.port}/`);
      console.log(`💬 Chat API available at http://localhost:${this.port}/api/chat`);
      console.log(`📚 Book Info API available at http://localhost:${this.port}/api/book-info`);
      console.log(`📡 Health check available at http://localhost:${this.port}/health`);
    });
  }

  async initializeServices() {
    // Try different environment variable names for API keys
    const apiKey = process.env.GEMINI_API_KEY ||
                   process.env.DASHSCOPE_API_KEY ||
                   process.env.OPENAI_API_KEY ||
                   process.env.OpenRouter_API_KEY;

    if (!apiKey) {
      console.error('ERROR: No API key found!');
      console.error('Please set one of these environment variables:');
      console.error('- GEMINI_API_KEY (for Google Gemini)');
      console.error('- DASHSCOPE_API_KEY (for Qwen API)');
      console.error('- OPENAI_API_KEY (for OpenAI)');
      console.error('- OpenRouter_API_KEY (for OpenRouter with Mistral model)');
      console.error('Get your API key from: https://makersuite.google.com/app/apikey');
      process.exit(1);
    }

    this.geminiService = new GeminiService(apiKey);

    try {
      await this.geminiService.initialize();
      console.log('AI service initialized successfully');
      
      // Load book content from Docusaurus docs
      this.bookContent = await this.loadBookContentFromDocs();
      console.log('Book content loaded from docs directory');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      process.exit(1);
    }
  }

  async loadBookContentFromDocs() {
    // Read content from the docs directory in book-site
    const docsPath = path.join(__dirname, 'book', 'book-site', 'docs');

    try {
      const files = await fs.readdir(docsPath);
      let content = '# Physical AI: Human-Robot Artificial Intelligence\n\n';

      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.mdx')) {
          const filePath = path.join(docsPath, file);
          const fileContent = await fs.readFile(filePath, 'utf8');

          // Remove frontmatter if present (between --- delimiters)
          let cleanContent = fileContent;
          const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
          if (frontmatterRegex.test(cleanContent)) {
            cleanContent = cleanContent.replace(frontmatterRegex, '');
          }

          content += `\n\n## From ${file}\n\n${cleanContent}`;
        }
      }

      // Also read content from subdirectories (chapters)
      const subdirs = await fs.readdir(docsPath, { withFileTypes: true });
      for (const dir of subdirs) {
        if (dir.isDirectory()) {
          const subdirPath = path.join(docsPath, dir.name);
          const subdirFiles = await fs.readdir(subdirPath);

          for (const file of subdirFiles) {
            if (file.endsWith('.md') || file.endsWith('.mdx')) {
              const filePath = path.join(subdirPath, file);
              const fileContent = await fs.readFile(filePath, 'utf8');

              // Remove frontmatter if present
              let cleanContent = fileContent;
              const frontmatterRegex = /^---\n[\s\S]*?\n---\n/;
              if (frontmatterRegex.test(cleanContent)) {
                cleanContent = cleanContent.replace(frontmatterRegex, '');
              }

              content += `\n\n## From ${dir.name}/${file}\n\n${cleanContent}`;
            }
          }
        }
      }

      return content;
    } catch (error) {
      console.warn('Could not read docs directory, using default content:', error.message);
      // Return default book content if docs can't be read
      return `
        # Physical AI: Human-Robot Artificial Intelligence

        ## Chapter 1: Introduction to Physical AI
        Physical AI refers to the integration of artificial intelligence with physical systems, particularly robots. It involves AI algorithms that control, sense, and interact with the physical world.

        ## Chapter 2: Hardware Components in Physical AI Systems
        Physical AI systems require specialized hardware including sensors, actuators, and computing units that can operate in real-time environments.

        ## Chapter 3: Sensors and Perception in Physical AI
        Sensory perception is crucial for Physical AI systems. Common sensors include cameras, LIDAR, ultrasonic sensors, and IMUs that provide environmental awareness.

        ## Chapter 4: Human-Robot Interaction in Physical AI
        Effective human-robot interaction requires intuitive interfaces, safety mechanisms, and responsive behaviors that align with human expectations.

        ## Chapter 5: Machine Learning in Physical AI Systems
        Machine learning algorithms enable Physical AI systems to adapt to new situations, learn from experience, and improve performance over time.
      `;
    }
  }

  setupRoutes() {
    // Serve the main HTML page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'ai-chatbot', 'index.html'));
    });

    // API endpoint for chat messages
    this.app.post('/api/chat', async (req, res) => {
      try {
        const { question } = req.body;

        console.log('Received question:', question);

        if (!question || question.trim() === '') {
          return res.status(400).json({
            success: false,
            error: 'Question is required'
          });
        }

        if (!this.geminiService) {
          return res.status(500).json({
            success: false,
            error: 'AI service not initialized'
          });
        }

        // Process the message using the Gemini service with book content
        const response = await this.geminiService.handleChatRequest(question);

        res.json({
          success: true,
          response: response,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error processing chat request:', error);

        // Handle specific error types
        if (error.message === 'API quota exceeded') {
          return res.status(429).json({
            success: false,
            error: 'API quota exceeded. Please check your account.'
          });
        }

        if (error.message === 'Server unavailable') {
          return res.status(503).json({
            success: false,
            error: 'Server unavailable. Please try again later.'
          });
        }

        res.status(500).json({
          success: false,
          error: 'Internal server error: ' + error.message
        });
      }
    });

    // API endpoint to get book information
    this.app.get('/api/book-info', (req, res) => {
      res.json({
        title: "Physical AI: Human-Robot Artificial Intelligence",
        description: "An advanced guide to combining artificial intelligence with physical systems, particularly robots, exploring how AI algorithms can be applied to control, sense, and interact with the physical world.",
        chapters: [
          "Introduction to Physical AI: Human-Robot Artificial Intelligence",
          "Hardware Components in Physical AI Systems",
          "Sensors and Perception in Physical AI",
          "Human-Robot Interaction in Physical AI",
          "Machine Learning in Physical AI Systems"
        ],
        topics: [
          "Robotics",
          "Artificial Intelligence",
          "Machine Learning",
          "Computer Vision",
          "Sensor Fusion",
          "Human-Robot Interaction",
          "Control Systems",
          "Embodied AI"
        ],
        loaded: true
      });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Book Site AI Assistant'
      });
    });
  }
}

// Export the class
module.exports = BookSiteAIAssistant;

// If running directly, initialize the application
if (require.main === module) {
  const assistant = new BookSiteAIAssistant();
}