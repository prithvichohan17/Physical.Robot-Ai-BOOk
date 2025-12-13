import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  subtitle?: string;
  author: string;
  description: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  chapters: Schema.Types.ObjectId[];
  published: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot be more than 300 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Book description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  coverImage: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  chapters: [{
    type: Schema.Types.ObjectId,
    ref: 'Chapter'
  }],
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);

export default Book;