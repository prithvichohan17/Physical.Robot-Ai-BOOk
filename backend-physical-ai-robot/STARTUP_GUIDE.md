# Physical AI Assistant - Getting Started Guide

This guide will help you run the Physical AI Assistant server and use the API endpoints correctly.

## Prerequisites

- Node.js 18+ 
- npm package manager
- Google Gemini API key (optional, but required for AI features)

## Installation & Setup

1. Make sure you have cloned the repository:
```bash
git clone https://github.com/prithvichohan17/Physical.Robot-Ai-BOOk.git
```

2. Navigate to the backend directory:
```bash
cd Ai-robot-book/backend-physical-ai-robot
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with your configuration:
```env
# Server Configuration
PORT=5000

# Database Configuration (optional, using in-memory by default)
MONGODB_URI=mongodb://localhost:27017/physical-ai-robot

# Google Gemini Configuration (required for AI features)
GEMINI_API_KEY=your-gemini-api-key-here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=12

# Other configurations
NODE_ENV=development
```

## Running the Server

Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints - CORRECT FORMAT

All API endpoints are prefixed with `/api`. Here are the correct URLs:

### Robot Control Endpoints
- `GET  http://localhost:5000/api/robot/status` - Get current robot state
- `POST http://localhost:5000/api/robot/move` - Move robot to coordinates
- `POST http://localhost:5000/api/robot/rotate` - Rotate robot
- `POST http://localhost:5000/api/robot/grab` - Control robot grabbers
- `POST http://localhost:5000/api/robot/speak` - Make robot speak text
- `POST http://localhost:5000/api/robot/photo` - Take photo with robot camera
- `GET  http://localhost:5000/api/robot/sensors` - Get sensor data

### AI Processing Endpoints
- `POST http://localhost:5000/api/ai/process-command` - Process natural language commands
- `POST http://localhost:5000/api/ai/ask-book-question` - Ask questions about book content
- `POST http://localhost:5000/api/ai/speak` - Make robot speak text

### Book Knowledge Endpoints
- `POST http://localhost:5000/api/book-knowledge/ask` - Ask questions about book content
- `GET  http://localhost:5000/api/book-knowledge/topics` - Get list of book topics
- `POST http://localhost:5000/api/book-knowledge/control-with-knowledge` - Control robot with book knowledge

## Common Issues & Solutions for 404 Errors

### 1. Missing `/api/` prefix
❌ Wrong: `http://localhost:5000/robot/status`
✅ Correct: `http://localhost:5000/api/robot/status`

### 2. Incorrect HTTP method
- Use `POST` for commands that send data
- Use `GET` for commands that retrieve data

### 3. Server not running
Make sure the server is running:
```bash
npm run dev
```
You should see: "Server is running on port 5000"

### 4. Testing with curl (examples)

Ask a question about the book:
```bash
curl -X POST http://localhost:5000/api/book-knowledge/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "How does sensor fusion work in robotics?"}'
```

Get robot status:
```bash
curl -X GET http://localhost:5000/api/robot/status
```

Control robot with natural language:
```bash
curl -X POST http://localhost:5000/api/ai/process-command \
  -H "Content-Type: application/json" \
  -d '{"userInput": "Say hello"}'
```

## Testing Script

To test if the server is responding correctly, run:
```bash
npm test
```

## Troubleshooting Tips

1. **Always include the `/api/` prefix** in your endpoint URLs
2. **Check the HTTP method** (GET vs POST) in your requests
3. **Verify server status** - make sure you see "Server is running on port 5000" in the console
4. **Check request body format** - POST requests should have proper JSON body with correct field names
5. **If you get 404, our server will show available routes** in the response to help you

## Example Valid Requests

✅ Working examples:
- `GET http://localhost:5000/` - Main page (returns API status)
- `GET http://localhost:5000/api/robot/status` - Robot status
- `POST http://localhost:5000/api/ai/speak` - with JSON body `{"text": "Hello"}`

⚠️ Common mistakes:
- `GET http://localhost:5000/robot/status` (missing /api/ prefix)
- Using GET instead of POST for commands that require data

If you continue having issues, please check that the server is running and that you're using the correct URL format with the `/api/` prefix!