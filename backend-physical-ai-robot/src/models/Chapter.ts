import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IChapter extends Document {
  title: string;
  book: Schema.Types.ObjectId;
  content: Schema.Types.ObjectId;
  number: number;
  description?: string;
  published: boolean;
  publishedAt?: Date;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  content: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  number: {
    type: Number,
    required: [true, 'Chapter number is required'],
    min: [1, 'Chapter number must be at least 1']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
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

const Chapter: Model<IChapter> = mongoose.model<IChapter>('Chapter', chapterSchema);

export default Chapter;