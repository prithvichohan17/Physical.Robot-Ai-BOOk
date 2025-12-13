import { Request, Response, NextFunction } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export default auth;
//# sourceMappingURL=auth.d.ts.map