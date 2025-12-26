# Physical AI Assistant System

A comprehensive AI-powered system that combines book knowledge with physical robot control, allowing users to ask questions about the "Physical AI Robot Book" and control a physical robot using AI-derived instructions.

## Overview

This system consists of two main components:
1. **Backend API** - Provides RESTful endpoints for robot control and book knowledge access
2. **AI Processing** - Integrates Google Gemini API with book content to understand questions and generate robot commands

The system enables users to:
- Ask questions about physical AI robotics concepts from the book
- Control a physical robot based on book-derived best practices
- Get AI-generated explanations of robotics concepts
- Receive book-referenced guidance for robot operations

## Features

- **Book Knowledge Integration**: AI assistant understands and references the Physical AI Robot Book content
- **Physical Robot Control**: Move, rotate, grab, speak, and take photos with the physical robot
- **Intelligent Command Processing**: AI interprets user requests and generates appropriate robot actions
- **Real-time Robot State Monitoring**: Track robot position, orientation, battery, and sensor data
- **Contextual Responses**: AI combines book knowledge with robot state for better responses

## Tech Stack

- **Node.js** - Server runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Typed JavaScript superset
- **Google Gemini API** - Language model for understanding and generating responses
- **SQLite** - Vector database for book content embeddings

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Google Gemini API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/prithvichohan17/Physical.Robot-Ai-BOOk.git
cd Ai-robot-book/backend-physical-ai-robot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
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

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm run dev  # for development
npm start    # for production (after building)
```

## API Endpoints

### Robot Control
- `GET /api/robot/status` - Get current robot state
- `POST /api/robot/move` - Move robot to coordinates
- `POST /api/robot/rotate` - Rotate robot
- `POST /api/robot/grab` - Control robot grabbers
- `POST /api/robot/speak` - Make robot speak text
- `POST /api/robot/photo` - Take photo with robot camera
- `GET /api/robot/sensors` - Get sensor data

### AI Processing
- `POST /api/ai/process-command` - Process natural language commands
- `POST /api/ai/ask-book-question` - Ask questions about book content
- `POST /api/ai/speak` - Make robot speak text

### Book Knowledge
- `POST /api/book-knowledge/ask` - Ask questions about book content
- `GET /api/book-knowledge/topics` - Get list of book topics
- `POST /api/book-knowledge/control-with-knowledge` - Control robot with book knowledge

## Usage Examples

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
  -d '{"userInput": "Move to the kitchen and take a photo"}'
```

### Move the robot directly:
```bash
curl -X POST http://localhost:5000/api/robot/move \
  -H "Content-Type: application/json" \
  -d '{"x": 10, "y": 5, "z": 0}'
```

## Architecture

The system works in the following way:

1. **Book Content Loading**: System reads all .md files from the book-site/docs directory
2. **Question Processing**: When a query is made, the system searches for relevant book content
3. **AI Integration**: OpenAI API processes the user's request in context of book knowledge and robot state
4. **Action Execution**: If the response contains an ACTION command, the robot performs the requested action
5. **Response Generation**: User receives an intelligent response with book references where applicable

## Physical Robot Integration

The system simulates robot actions. To connect to a real robot:

1. Modify the `RobotActions` class in `src/controllers/robotController.ts`
2. Replace the mock methods with actual hardware control code
3. Implement communication protocols (e.g., ROS, MQTT, HTTP API) for your specific robot

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

## Security

- JWT tokens for authentication
- Input validation on all endpoints
- CORS configured for secure cross-origin requests
- Helmet.js for security headers

## Contributing

1. Fork the repository at https://github.com/prithvichohan17/Physical.Robot-Ai-BOOk.git
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

If you encounter issues or have questions:
- Check the API documentation
- Review the error logs
- Open an issue in the repository at https://github.com/prithvichohan17/Physical.Robot-Ai-BOOk.git