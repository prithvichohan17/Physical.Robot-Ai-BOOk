import { Document, Model, Schema } from 'mongoose';
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
declare const Chapter: Model<IChapter>;
export default Chapter;
//# sourceMappingURL=Chapter.d.ts.map