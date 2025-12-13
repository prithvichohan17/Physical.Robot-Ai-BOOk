import { Document, Model, Schema } from 'mongoose';
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
declare const Book: Model<IBook>;
export default Book;
//# sourceMappingURL=Book.d.ts.map