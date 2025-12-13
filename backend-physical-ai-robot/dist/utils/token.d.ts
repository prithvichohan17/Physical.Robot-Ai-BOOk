interface TokenPayload {
    id: string;
}
export declare const generateToken: (id: string) => string;
export declare const verifyToken: (token: string) => TokenPayload | null;
export {};
//# sourceMappingURL=token.d.ts.map