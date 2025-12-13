import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
}

// Generate JWT
export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string || 'your-super-secret-jwt-key';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  } as jwt.SignOptions);
};

// Verify JWT
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET as string || 'your-super-secret-jwt-key';
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};