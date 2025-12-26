# AI Robot Book Project

This repository contains materials related to an AI-powered physical robot book project with multiple AI assistant integrations.

## Structure

- `book/`: Contains the Physical-Robot-Ai-BOOK content from [prithvichohan17/Physical-Robot-Ai-BOOk](https://github.com/prithvichohan17/Physical-Robot-Ai-BOOk)
- `ai-chatbot/`: AI assistant using Qwen API with vector database of book content
- `backend-physical-ai-robot/`: Physical robot control backend with Google Gemini AI integration

## AI Assistant Systems

### 1. Qwen AI Assistant (`ai-chatbot/`)

The Qwen-powered assistant is located in the `ai-chatbot/` directory and uses Alibaba Cloud's Qwen API to answer questions about the book content.

**Setup:**
1. Get a Qwen API key from [DashScope Console](https://dashscope.console.alibabacloud.com/)
2. Create a `.env` file in the root directory with your API key:
   ```
   DASHSCOPE_API_KEY=your_actual_qwen_api_key_here
   ```
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. The server runs on `http://localhost:3000`

### 2. Book Site AI Assistant (Integrated Experience)

The new Book Site AI Assistant combines your Docusaurus book site with AI chat capabilities for a unified experience.

**Setup:**
1. Ensure you have an API key set in your `.env` file (any of: GEMINI_API_KEY, DASHSCOPE_API_KEY, OPENAI_API_KEY, or OpenRouter_API_KEY)
2. Build the Docusaurus book site: `npm run build-book`
3. Start the assistant: `npm run book-assistant`
4. Access the integrated interface at `http://localhost:3001/book-assistant`
5. Access the full book site at `http://localhost:3001/book`

**Features:**
- Unified interface with book content preview and AI chat
- Full Docusaurus book site integration
- AI assistant with access to all book content
- Responsive design for different screen sizes

### 3. Google Gemini Physical AI Assistant (`backend-physical-ai-robot/`)

The Gemini-powered physical robot controller is located in the `backend-physical-ai-robot/` directory and uses Google's Gemini API for advanced AI processing capabilities.

**Setup:**
1. Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Start the server: `npm run dev`
6. The server runs on `http://localhost:5000`

## API Endpoints

### Qwen AI Assistant (Port 3000)
- `GET /` - Main chat interface
- `GET /book-assistant` - Integrated book + AI interface
- `GET /book` - Full Docusaurus book site
- `POST /api/chat` - Send questions about book content
- `GET /api/book-info` - Book metadata
- `GET /health` - Health check

### Book Site AI Assistant (Port 3001)
- `GET /` - Main chat interface
- `GET /book-assistant` - Integrated book + AI interface
- `GET /book` - Full Docusaurus book site
- `POST /api/chat` - Send questions about book content
- `GET /api/book-info` - Book metadata
- `GET /health` - Health check

### Physical AI Assistant (Port 5000)
- `POST /api/ai/process-command` - Natural language robot control
- `POST /api/ai/ask-book-question` - Ask questions about book content
- `GET /api/robot/status` - Robot status
- `POST /api/robot/move` - Robot movement
- And more physical robot control endpoints (see backend documentation)

## Book Content

The book content can be found in the `book/Physical-Robot-Ai-BOOk` directory and is used by both AI systems to provide context-aware responses.

## Available Scripts

- `npm start` - Start the main AI assistant server on port 3000
- `npm run book-assistant` - Start the book site AI assistant server on port 3001
- `npm run build-book` - Build the Docusaurus book site
- `npm run dev` - Start development server with auto-restart

## Documentation

- `BOOK_SITE_AI_ASSISTANT_GUIDE.md` - Detailed guide for the book site AI assistant
- `PHYSICAL_AI_ASSISTANT_INTEGRATION.md` - Guide for the physical robot integration
- `GEMINI_API_SETUP.md` - Instructions for setting up Gemini API