# Physical AI Assistant with Google Gemini API

The Physical AI Assistant system now uses Google's Gemini API for advanced AI processing capabilities. This provides natural language understanding and robot command generation based on your book content.

## Features

- **Book Knowledge Integration**: AI assistant understands and references the Physical AI Robot Book content
- **Physical Robot Control**: Move, rotate, grab, speak, and take photos with the physical robot
- **Intelligent Command Processing**: Google Gemini AI interprets user requests and generates appropriate robot actions
- **Real-time Robot State Monitoring**: Track robot position, orientation, battery, and sensor data
- **Contextual Responses**: AI combines book knowledge with robot state for better responses

## Setup with Gemini API

1. **Get a Google Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an account or sign in
   - Create a new API key for the Gemini API
   - Copy your API key

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
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

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Build and Run**:
   ```bash
   npm run build
   npm run dev
   ```

## API Endpoints

All endpoints are available under `/api/`:

### Robot Control
- `GET /api/robot/status` - Get current robot state
- `POST /api/robot/move` - Move robot to coordinates
- `POST /api/robot/rotate` - Rotate robot
- `POST /api/robot/grab` - Control robot grabbers
- `POST /api/robot/speak` - Make robot speak text
- `POST /api/robot/photo` - Take photo with robot camera
- `GET /api/robot/sensors` - Get sensor data

### AI Processing with Gemini
- `POST /api/ai/process-command` - Process natural language commands with Gemini
- `POST /api/ai/ask-book-question` - Ask questions about book content with Gemini
- `POST /api/ai/speak` - Make robot speak text

### Book Knowledge with Gemini
- `POST /api/book-knowledge/ask` - Ask questions about book content with Gemini
- `GET /api/book-knowledge/topics` - Get list of book topics
- `POST /api/book-knowledge/control-with-knowledge` - Control robot with book knowledge via Gemini

## Example Usage

### Ask a question about the book:
```bash
curl -X POST http://localhost:5000/api/book-knowledge/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "How does sensor fusion work in robotics?"}'
```

### Control the robot with natural language:
```bash
curl -X POST http://localhost:5000/api/ai/process-command \
  -H "Content-Type: application/json" \
  -d '{"userInput": "Say hello to everyone"}'
```

### Move the robot directly:
```bash
curl -X POST http://localhost:5000/api/robot/move \
  -H "Content-Type: application/json" \
  -d '{"x": 10, "y": 5, "z": 0}'
```

## Google Gemini Integration

The system uses Google's Gemini Pro model to:
- Understand natural language queries about robotics concepts
- Generate appropriate robot commands based on book content
- Provide detailed explanations referencing your book material
- Combine contextual information with robot state awareness

## Troubleshooting

### Common Issues:

1. **404 Errors**: Make sure to include the `/api/` prefix in all endpoint URLs
2. **API Key Errors**: Verify your GEMINI_API_KEY is correctly set in the .env file
3. **CORS Issues**: The server allows cross-origin requests by default
4. **Server Not Running**: Check that the server started successfully on the configured port

### Verify Setup:
- Check that `GEMINI_API_KEY` is set in your `.env` file
- Confirm the server starts with "Server is running on port XXXX"
- Use the correct HTTP methods (GET/POST) for each endpoint
- Include proper JSON content-type headers for POST requests