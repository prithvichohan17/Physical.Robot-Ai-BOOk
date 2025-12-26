import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, send_file, send_from_directory, request
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BookSiteAIAgent:
    def __init__(self):
        self.app = Flask(__name__)
        self.port = int(os.getenv('PORT', 3002))
        self.api_key = None
        self.book_content = ''
        self.book_structure = {}
        self.conversation_history = []
        
        # Configure additional Flask settings
        self.app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable cache in debug
        
        # Initialize services
        self.initialize_services()
        
        # Setup routes
        self.setup_routes()
        
        # Setup error handlers
        self.setup_error_handlers()

    def initialize_services(self):
        """Initialize AI services and load book content"""
        # Try different environment variable names for API keys
        api_keys_to_try = [
            'GEMINI_API_KEY',
            'DASHSCOPE_API_KEY', 
            'OPENAI_API_KEY',
            'OpenRouter_API_KEY'
        ]
        
        for key_name in api_keys_to_try:
            if os.getenv(key_name):
                self.api_key = os.getenv(key_name)
                logger.info(f"Using API key from {key_name}")
                break
        
        if not self.api_key:
            logger.error("ERROR: No API key found!")
            logger.error("Please set one of these environment variables:")
            logger.error("- GEMINI_API_KEY (for Google Gemini)")
            logger.error("- DASHSCOPE_API_KEY (for Qwen API)")
            logger.error("- OPENAI_API_KEY (for OpenAI)")
            logger.error("- OpenRouter_API_KEY (for OpenRouter with Mistral model)")
            sys.exit(1)

        # Load book content from Docusaurus docs
        self.book_content = self.load_book_content_from_docs()
        self.book_structure = self.build_book_structure()
        logger.info("Book content and structure loaded successfully")

    def build_book_structure(self):
        """Build the book structure with chapters and topics"""
        structure = {
            'chapters': [],
            'sections': [],
            'topics': []
        }

        docs_path = Path(__file__).parent / 'book' / 'book-site' / 'docs'

        try:
            if docs_path.exists():
                # Get all markdown files
                for file_path in docs_path.rglob('*.md'):
                    if file_path.is_file():
                        # Read file content to extract title
                        content = file_path.read_text(encoding='utf-8')
                        title = self.extract_title(content, file_path.name)
                        
                        # Add to chapters list
                        relative_path = file_path.relative_to(docs_path)
                        structure['chapters'].append({
                            'id': str(relative_path),
                            'title': title,
                            'path': str(relative_path),
                            'directory': file_path.parent.name
                        })

                # Extract topics from content
                topics = self.extract_topics(self.book_content)
                structure['topics'] = topics

            return structure
        except Exception as e:
            logger.warning(f"Could not build book structure: {str(e)}")
            return structure

    def extract_title(self, content, filename):
        """Extract title from markdown content"""
        lines = content.split('\n')
        
        # Look for first heading
        for line in lines:
            if line.startswith('# '):
                return line[2:].strip()
        
        # Fallback to filename
        return filename.replace('.md', '').replace('-', ' ').replace('_', ' ')

    def extract_topics(self, content):
        """Extract topics from headings in the content"""
        topics = []
        lines = content.split('\n')
        
        for line in lines:
            if line.startswith('## '):
                topic = line[3:].strip()
                if topic not in topics:
                    topics.append(topic)
        
        return topics

    def load_book_content_from_docs(self):
        """Load book content from Docusaurus docs directory"""
        docs_path = Path(__file__).parent / 'book' / 'book-site' / 'docs'

        try:
            content = "# Physical AI: Human-Robot Artificial Intelligence\n\n"

            if docs_path.exists():
                # Read content from all markdown files
                for file_path in docs_path.rglob('*.md'):
                    if file_path.is_file():
                        file_content = file_path.read_text(encoding='utf-8')

                        # Remove frontmatter if present (between --- delimiters)
                        lines = file_content.split('\n')
                        if len(lines) > 2 and lines[0] == '---':
                            # Find the end of frontmatter
                            frontmatter_end = -1
                            for i, line in enumerate(lines[1:], 1):
                                if line == '---':
                                    frontmatter_end = i
                                    break
                            
                            if frontmatter_end > 0:
                                file_content = '\n'.join(lines[frontmatter_end + 1:])

                        content += f"\n\n## From {file_path.name}\n\n{file_content}"

            return content
        except Exception as e:
            logger.warning(f"Could not read docs directory, using default content: {str(e)}")
            
            # Return default book content if docs can't be read
            return """
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
            """

    def call_ai_api(self, prompt):
        """Call the AI API with the given prompt"""
        # Using OpenRouter API as in the original implementation
        url = "https://openrouter.ai/api/v1/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": f"http://localhost:{self.port}",
            "X-Title": "Physical AI Book Assistant"
        }
        
        payload = {
            "model": "mistralai/devstral-2512:free",  # Free Mistral model
            "messages": [
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Please provide a helpful response based on the context provided."}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            data = response.json()
            if 'choices' in data and len(data['choices']) > 0:
                return data['choices'][0]['message']['content'].strip()
            else:
                raise Exception("No response from AI API")
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling AI API: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                if e.response.status_code == 429:
                    raise Exception("API quota exceeded")
                elif e.response.status_code >= 500:
                    raise Exception("Server unavailable")
                elif e.response.status_code == 401:
                    raise Exception("Invalid API key")
                else:
                    raise Exception(f"API error: {e.response.status_code} - {e.response.reason}")
            else:
                raise Exception("Network error: Unable to reach the API server")

    def setup_routes(self):
        """Setup application routes"""
        # Main page route
        @self.app.route('/')
        def home():
            try:
                html_path = Path(__file__).parent / 'ai-chatbot' / 'index.html'
                if html_path.exists():
                    return send_file(html_path)
                else:
                    return '<h1>AI Book Agent - Home</h1><p>Welcome to the AI Book Agent assistant.</p>', 200
            except Exception as e:
                logger.error(f"Error serving home page: {str(e)}")
                return "Error loading page", 500

        # Book site integration page
        @self.app.route('/book-site-integration')
        def book_site_integration():
            try:
                html_path = Path(__file__).parent / 'ai-chatbot' / 'book-site-integration.html'
                if html_path.exists():
                    return send_file(html_path)
                else:
                    return '<h1>Book Site Integration</h1><p>Book site integration page.</p>', 200
            except Exception as e:
                logger.error(f"Error serving book site integration page: {str(e)}")
                return "Error loading page", 500

        # Agent-specific chat endpoint
        @self.app.route('/api/agent/chat', methods=['POST'])
        def agent_chat():
            try:
                data = request.get_json()
                question = data.get('question', '').strip()
                context = data.get('context', None)
                conversation_id = data.get('conversation_id', None)

                logger.info(f'AI Agent received question: {question}')

                if not question:
                    return jsonify({
                        'success': False,
                        'error': 'Question is required'
                    }), 400

                # Build context-aware prompt for the agent
                system_prompt = f"""You are an advanced AI Agent for the "Physical AI: Human-Robot Artificial Intelligence" book.
                Your capabilities include:
                1. Answering questions about the book content
                2. Providing detailed explanations of concepts
                3. Guiding users to specific chapters or sections
                4. Summarizing key topics
                5. Making connections between different concepts

                Book Structure:
                Chapters: {', '.join([ch['title'] for ch in self.book_structure['chapters']])}
                Topics: {', '.join(self.book_structure['topics'][:10])} (first 10 topics)

                Use the following book information to answer the user's question:

                {self.book_content}

                Provide a helpful, accurate, and comprehensive response based on the book content.
                When relevant, suggest specific chapters or sections that might interest the user.
                Keep your responses informative and well-structured.

                User Question: {question}"""

                # Process the message using the AI API
                response = self.call_ai_api(system_prompt)

                # Store in conversation history
                conversation_entry = {
                    'id': str(int(datetime.now().timestamp() * 1000)),
                    'timestamp': datetime.utcnow().isoformat() + 'Z',
                    'question': question,
                    'response': response,
                    'conversation_id': conversation_id or 'default'
                }

                self.conversation_history.append(conversation_entry)

                # Keep only last 50 conversations to prevent memory issues
                if len(self.conversation_history) > 50:
                    self.conversation_history = self.conversation_history[-50:]

                return jsonify({
                    'success': True,
                    'response': response,
                    'conversation_id': conversation_entry['id'],
                    'timestamp': datetime.utcnow().isoformat() + 'Z',
                    'suggestions': self.generate_suggestions(question)
                })

            except Exception as e:
                logger.error(f'Error processing agent chat request: {str(e)}')
                
                if str(e) == 'API quota exceeded':
                    return jsonify({
                        'success': False,
                        'error': 'API quota exceeded. Please check your account.'
                    }), 429
                elif str(e) == 'Server unavailable':
                    return jsonify({
                        'success': False,
                        'error': 'Server unavailable. Please try again later.'
                    }), 503
                elif str(e) == 'Invalid API key':
                    return jsonify({
                        'success': False,
                        'error': 'Invalid API key'
                    }), 401
                else:
                    return jsonify({
                        'success': False,
                        'error': f'Internal server error: {str(e)}'
                    }), 500

        # Enhanced book information endpoint
        @self.app.route('/api/book-info', methods=['GET'])
        def book_info():
            return jsonify({
                'title': "Physical AI: Human-Robot Artificial Intelligence",
                'description': "An advanced guide to combining artificial intelligence with physical systems, particularly robots, exploring how AI algorithms can be applied to control, sense, and interact with the physical world.",
                'chapters': self.book_structure['chapters'],
                'topics': self.book_structure['topics'],
                'total_chapters': len(self.book_structure['chapters']),
                'total_topics': len(self.book_structure['topics']),
                'loaded': True
            })

        # Get conversation history
        @self.app.route('/api/conversations', methods=['GET'])
        def get_conversations():
            return jsonify({
                'success': True,
                'conversations': self.conversation_history,
                'count': len(self.conversation_history)
            })

        # Get specific conversation
        @self.app.route('/api/conversations/<conversation_id>', methods=['GET'])
        def get_conversation(conversation_id):
            conversation = next((c for c in self.conversation_history if c['id'] == conversation_id), None)

            if not conversation:
                return jsonify({
                    'success': False,
                    'error': 'Conversation not found'
                }), 404

            return jsonify({
                'success': True,
                'conversation': conversation
            })

        # Get book structure
        @self.app.route('/api/book-structure', methods=['GET'])
        def book_structure():
            return jsonify({
                'success': True,
                'structure': self.book_structure
            })

        # Serve static files from ai-chatbot directory
        @self.app.route('/static/<path:filename>')
        def static_files(filename):
            return send_from_directory(Path(__file__).parent / 'ai-chatbot', filename)

        # Health check endpoint
        @self.app.route('/health', methods=['GET'])
        def health():
            return jsonify({
                'status': 'OK',
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'service': 'Book Site AI Agent',
                'capabilities': [
                    'Advanced Q&A',
                    'Context-aware responses',
                    'Book navigation',
                    'Conversation history',
                    'Topic suggestions'
                ]
            })

    def generate_suggestions(self, question):
        """Generate context-aware suggestions based on the question"""
        suggestions = []
        
        # Look for relevant topics in the question
        question_lower = question.lower()
        
        # Find matching topics
        matching_topics = [topic for topic in self.book_structure['topics'] 
                          if question_lower in topic.lower() or 
                          topic.lower() in question_lower]
        
        if matching_topics:
            suggestions.append(f"You might also be interested in learning more about: {', '.join(matching_topics[:3])}")
        
        # Find relevant chapters
        relevant_chapters = [chapter for chapter in self.book_structure['chapters'] 
                            if question_lower in chapter['title'].lower()]
        
        if relevant_chapters:
            suggestions.append(f"See chapter: {relevant_chapters[0]['title']}")
        
        return suggestions

    def setup_error_handlers(self):
        """Setup error handlers for the application"""
        @self.app.errorhandler(404)
        def not_found(error):
            return jsonify({'error': 'Endpoint not found'}), 404

        @self.app.errorhandler(500)
        def internal_error(error):
            logger.error(f"Internal server error: {str(error)}")
            return jsonify({'error': 'Internal server error'}), 500

        @self.app.errorhandler(Exception)
        def handle_exception(e):
            logger.error(f"Unhandled exception: {str(e)}")
            return jsonify({'error': 'An unexpected error occurred'}), 500

    def init(self):
        """Initialize and start the application"""
        try:
            logger.info(f'Starting Book Site AI Agent on port {self.port}')
            print(f'🚀 Book Site AI Agent Server is running on http://localhost:{self.port}')
            print(f'📚 Book site integration available at http://localhost:{self.port}/book-site-integration')
            print(f'🤖 AI Agent interface available at http://localhost:{self.port}/')
            print(f'🤖 Agent API available at http://localhost:{self.port}/api/agent/chat')
            print(f'📚 Book Info API available at http://localhost:{self.port}/api/book-info')
            print(f'📡 Health check available at http://localhost:{self.port}/health')
            
            # Run the Flask app
            self.app.run(
                host='0.0.0.0',
                port=self.port,
                debug=bool(os.getenv('FLASK_DEBUG', False)),
                threaded=True
            )
        except KeyboardInterrupt:
            logger.info("Application stopped by user")
            sys.exit(0)
        except Exception as e:
            logger.error(f"Error starting application: {str(e)}")
            sys.exit(1)


# If running directly, initialize the application
if __name__ == '__main__':
    agent = BookSiteAIAgent()
    agent.init()