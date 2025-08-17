import { Request, Response, NextFunction } from 'express';
import { authService } from '../auth-service';
import '../types/session.d';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log('🔐 Auth middleware check - Session user exists:', !!req.session?.user);
  console.log('🔐 Auth middleware check - Session token exists:', !!req.session?.token);
  
  const sessionUser = req.session?.user;
  const sessionToken = req.session?.token;
  
  // Check for JWT token in Authorization header as well
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  console.log('🔐 Auth middleware check - Bearer token exists:', !!bearerToken);
  
  // Priority: session-based auth first (for web users), then Bearer token (for API clients)
  if (sessionUser && sessionToken) {
    // Session-based authentication (user logged in via web interface)
    try {
      const isValid = await authService.validateToken(sessionToken);
      console.log('🔐 Session token validation result:', isValid);
      if (isValid) {
        console.log('🔐 Authentication successful via session');
        return next();
      }
    } catch (error) {
      console.log('🔐 Session token validation failed:', error);
    }
  }
  
  // Fall back to Bearer token authentication
  if (bearerToken) {
    try {
      const isValid = await authService.validateToken(bearerToken);
      console.log('🔐 Bearer token validation result:', isValid);
      if (isValid) {
        console.log('🔐 Authentication successful via bearer token');
        return next();
      }
    } catch (error) {
      console.log('🔐 Bearer token validation failed:', error);
    }
  }
  
  // If we get here, authentication failed
  console.log('🔐 Authentication failed - destroying session');
  if (req.session) {
    req.session.destroy(() => {});
  }
  
  return res.status(401).json({ error: 'Authentication required' });
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