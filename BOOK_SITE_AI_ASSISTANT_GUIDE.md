# Book Site AI Assistant Guide

This guide explains how to set up and use the integrated Book Site AI Assistant that combines your Docusaurus book site with AI chat capabilities.

## Overview

The Book Site AI Assistant provides:
- A unified interface combining your book content with an AI assistant
- Access to the full Docusaurus book site
- An AI chat interface that can answer questions about the book content
- Integration between the static book content and dynamic AI responses

## Setup

### 1. Prerequisites

Make sure you have:
- Node.js installed (version 18 or higher)
- An API key for one of the supported AI services:
  - Google Gemini API key (GEMINI_API_KEY)
  - Qwen API key (DASHSCOPE_API_KEY)
  - OpenAI API key (OPENAI_API_KEY)
  - OpenRouter API key (OpenRouter_API_KEY)

### 2. Environment Configuration

Create or update your `.env` file in the root directory with your API key:

```bash
# Choose one of these API keys
GEMINI_API_KEY=your_gemini_api_key_here
# OR
DASHSCOPE_API_KEY=your_qwen_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here
# OR
OpenRouter_API_KEY=your_openrouter_api_key_here
```

### 3. Install Dependencies

If you haven't already, install the project dependencies:

```bash
npm install
```

## Building the Book Site

Before running the assistant, make sure your Docusaurus book site is built:

```bash
npm run build-book
```

This will build the Docusaurus site in the `book/book-site` directory.

## Running the Book Site AI Assistant

### Option 1: Using the dedicated script

```bash
npm run book-assistant
```

### Option 2: Direct execution

```bash
node book-site-ai-assistant.js
```

The assistant will start on port 3001 by default.

## Features

### 1. Unified Interface

The assistant provides a unified interface at `http://localhost:3001/book-assistant` that includes:
- A preview of your book content on the left
- An AI chat interface on the right
- Easy access to the full book site

### 2. Full Book Site Access

The complete Docusaurus book site is available at `http://localhost:3001/book`

### 3. AI Chat Capabilities

The AI assistant can answer questions about your book content, including:
- Technical concepts explained in the book
- Cross-references between different sections
- Detailed explanations of complex topics
- Practical examples and applications

## API Endpoints

The assistant provides several API endpoints:

- `GET /` - Main chat interface
- `GET /book-assistant` - Integrated book + AI interface
- `GET /book` - Full Docusaurus book site
- `POST /api/chat` - Chat API endpoint
- `GET /api/book-info` - Book metadata
- `GET /health` - Health check

## Configuration

### Changing the Port

To run on a different port, set the PORT environment variable:

```bash
PORT=4000 npm run book-assistant
```

### API Key Configuration

The assistant tries multiple environment variable names for API keys in this order:
1. `GEMINI_API_KEY`
2. `DASHSCOPE_API_KEY`
3. `OPENAI_API_KEY`
4. `OpenRouter_API_KEY`

## Troubleshooting

### Book Site Not Loading

If the book site isn't loading at `/book`, make sure you've run:
```bash
npm run build-book
```

### AI Assistant Not Responding

1. Verify your API key is correctly set in the `.env` file
2. Check that the environment variable name matches your API provider
3. Ensure your API provider has sufficient quota/credits
4. Check the server console for specific error messages

### Content Not Found

The assistant will try to load content from:
- `book/book-site/docs/*.md`
- `book/book-site/docs/*.mdx`
- Subdirectories within the docs folder

Make sure your book content is in these locations.

## Integration with Main Server

The main server (`npm start`) also includes the book assistant functionality:
- Main chat interface: `http://localhost:3000`
- Book assistant interface: `http://localhost:3000/book-assistant`
- Full book site: `http://localhost:3000/book`

## Development

For development with auto-restart on changes:

```bash
npm install -g nodemon
nodemon book-site-ai-assistant.js
```

## Architecture

The Book Site AI Assistant combines:
- Express.js server for API and static file serving
- Docusaurus-generated static site for book content
- AI service (using gemini-service.js) for chat capabilities
- Unified frontend interface for seamless experience

The system reads book content from the Docusaurus docs directory and provides it as context to the AI model for accurate responses.