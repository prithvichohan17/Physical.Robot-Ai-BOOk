// Root server for Physical AI Book Assistant - Full Book Information Chatbot
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const GeminiService = require('./ai-chatbot/gemini-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the ai-chatbot directory
app.use(express.static(path.join(__dirname, 'ai-chatbot')));

// Initialize Gemini service with API key
let geminiService;

async function initializeServices() {
  // Try different environment variable names for API keys
  const apiKey = process.env.GEMINI_API_KEY ||
                 process.env.DASHSCOPE_API_KEY ||
                 process.env.OPENAI_API_KEY ||
                 process.env.OpenRouter_API_KEY; // Added OpenRouter support

  if (!apiKey) {
    console.error('ERROR: No API key found!');
    console.error('Please set one of these environment variables:');
    console.error('- GEMINI_API_KEY (for Google Gemini)');
    console.error('- DASHSCOPE_API_KEY (for Qwen API)');
    console.error('- OPENAI_API_KEY (for OpenAI)');
    console.error('- OpenRouter_API_KEY (for OpenRouter with Mistral model)');
    console.error('Get your Gemini API key from: https://makersuite.google.com/app/apikey');
    process.exit(1);
  }

  geminiService = new GeminiService(apiKey);

  try {
    await geminiService.initialize();
    console.log('AI service initialized successfully');
    console.log('Full book information from "Physical AI: Human-Robot Artificial Intelligence" has been loaded');
  } catch (error) {
    console.error('Failed to initialize AI service:', error);
    process.exit(1);
  }
}

// Initialize services on startup
initializeServices();

// Serve the main HTML page from ai-chatbot directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-chatbot', 'index.html'));
});

// Serve the book site integration page
app.get('/book-assistant', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-chatbot', 'book-site-integration.html'));
});

// Serve book site from the book directory
app.use('/book', express.static(path.join(__dirname, 'book', 'book-site', 'build')));

// API endpoint for chat messages - Full Book Information Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;

    console.log('Received question:', question);

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }

    if (!geminiService) {
      return res.status(500).json({
        success: false,
        error: 'AI service not initialized'
      });
    }

    // Process the message using the Gemini service with full book information
    const response = await geminiService.handleChatRequest(question);

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
app.get('/api/book-info', (req, res) => {
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
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Physical AI Book Assistant - Full Book Information Chatbot'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Physical AI Book Assistant Server is running on http://localhost:${PORT}`);
  console.log(`💬 Chat API available at http://localhost:${PORT}/api/chat`);
  console.log(`📚 Book Info API available at http://localhost:${PORT}/api/book-info`);
  console.log(`📡 Health check available at http://localhost:${PORT}/health`);
  console.log(`📖 Full book information from "Physical AI: Human-Robot Artificial Intelligence" is loaded and ready for Q&A`);
  console.log(`🔑 Make sure to set your API key in the .env file before starting`);
  console.log(`\n💡 To use the chatbot, open your browser and go to http://localhost:${PORT}`);
});