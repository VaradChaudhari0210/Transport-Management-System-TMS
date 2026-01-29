import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthContext {
  userId?: string;
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const generateToken = (userId: string, email: string, name: string, role: Role): string => {
  return jwt.sign({ userId, email, name, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string; email: string; name: string; role: Role } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string; role: Role };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const requireAuth = (context: AuthContext): void => {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
};

export const requireAdmin = (context: AuthContext): void => {
  requireAuth(context);
  if (context.user?.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
};

export const getAuthContext = async (
  req: any,
  prisma: PrismaClient
): Promise<AuthContext> => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return {};
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {};
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return {};
  }

  return {
    userId: user.id,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
