# Physical AI Robot Backend

This is the backend API for the Physical AI Robot book project. It provides a RESTful API for managing book content, chapters, and associated resources.

## Features

- User authentication and authorization (JWT)
- Book management (CRUD operations)
- Chapter management (CRUD operations)
- Content management (text, images, code, videos, equations)
- Role-based access control (user, author, admin)
- RESTful API design
- Support for both MongoDB and in-memory database (for development)
- TypeScript for type safety

## Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (production)
- **In-memory storage** - For development without MongoDB
- **TypeScript** - Typed superset of JavaScript
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-Origin Resource Sharing
- **Helmet** - Security middleware

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the backend directory:
```bash
cd backend-physical-ai-robot
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add the following environment variables:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/physical-ai-robot

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=12

# Other configurations
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Chapters
- `GET /api/chapters` - Get all chapters
- `GET /api/chapters/:id` - Get a specific chapter
- `POST /api/chapters` - Create a new chapter
- `PUT /api/chapters/:id` - Update a chapter
- `DELETE /api/chapters/:id` - Delete a chapter

### Content
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get specific content
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

## Data Structure (In-Memory)

### User
- `_id`: String (generated timestamp)
- `name`: String (required, max 50 chars)
- `email`: String (required, unique)
- `password`: String (required, min 6 chars, hashed)
- `role`: String (enum: 'user', 'author', 'admin', default: 'user')
- `createdAt`: Date
- `updatedAt`: Date

### Book
- `_id`: String (generated timestamp)
- `title`: String (required, max 200 chars)
- `subtitle`: String (optional, max 300 chars)
- `author`: String (required)
- `description`: String (required, max 1000 chars)
- `coverImage`: String (optional)
- `category`: String (optional)
- `tags`: [String] (optional)
- `chapters`: [String] (array of chapter IDs)
- `published`: Boolean (default: false)
- `publishedAt`: Date (optional)
- `views`: Number (default: 0)
- `likes`: Number (default: 0)
- `createdAt`: Date
- `updatedAt`: Date

### Chapter
- `_id`: String (generated timestamp)
- `title`: String (required, max 200 chars)
- `book`: String (ID of the book this chapter belongs to)
- `content`: String (ID of associated content)
- `number`: Number (required, min 1)
- `description`: String (optional, max 500 chars)
- `published`: Boolean (default: false)
- `publishedAt`: Date (optional)
- `views`: Number (default: 0)
- `likes`: Number (default: 0)
- `createdAt`: Date
- `updatedAt`: Date

### Content
- `_id`: String (generated timestamp)
- `chapter`: String (ID of the chapter this content belongs to)
- `type`: String (enum: 'text', 'image', 'code', 'video', 'equation', required)
- `content`: String (required)
- `order`: Number (required, min 0)
- `metadata`: Object (optional)
- `createdAt`: Date
- `updatedAt`: Date

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.