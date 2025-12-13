import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
    isModified(path: string): boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=User.d.ts.map