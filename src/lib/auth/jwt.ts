import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'drjadmin';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  plan: string;
  accountName?: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: TokenPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Decode JWT token without verification (for debugging)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
}
