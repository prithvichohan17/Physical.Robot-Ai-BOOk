import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IContent extends Document {
  chapter: Schema.Types.ObjectId;
  type: 'text' | 'image' | 'code' | 'video' | 'equation';
  content: string;
  order: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema: Schema = new Schema({
  chapter: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'code', 'video', 'equation'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const Content: Model<IContent> = mongoose.model<IContent>('Content', contentSchema);

export default Content;