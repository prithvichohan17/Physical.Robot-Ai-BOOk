import { Document, Model, Schema } from 'mongoose';
export interface IContent extends Document {
    chapter: Schema.Types.ObjectId;
    type: 'text' | 'image' | 'code' | 'video' | 'equation';
    content: string;
    order: number;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}
declare const Content: Model<IContent>;
export default Content;
//# sourceMappingURL=Content.d.ts.map