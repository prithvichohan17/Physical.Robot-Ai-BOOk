export declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export declare const handleAsync: (fn: Function) => (req: any, res: any, next: any) => void;
//# sourceMappingURL=error.d.ts.map