import { Request, Response, NextFunction } from 'express';
import { authService } from '../auth-service';
import '../types/session';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionUser = req.session?.user;
  const sessionToken = req.session?.token;
  
  // Check for JWT token in Authorization header as well
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  const token = sessionToken || bearerToken;
  
  if (!token || !sessionUser) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const isValid = await authService.validateToken(token);
    
    if (!isValid) {
      req.session?.destroy(() => {});
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

export async function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionUser = req.session?.user;
    
    if (!sessionUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (sessionUser.role !== role && sessionUser.role !== 'admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

export async function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionUser = req.session?.user;
    
    if (!sessionUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Admin has all permissions
    if (sessionUser.role === 'admin') {
      return next();
    }
    
    if (!sessionUser.permissions?.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}