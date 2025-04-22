import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index';

dotenv.config();

// Extending Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

/**
 * Authentication Middleware Class
 * Handles JWT token verification and role-based authorization
 */
export class AuthMiddleware {
  private readonly jwtSecret: string;
  private readonly refreshSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  }

  /**
   * Middleware to protect routes - verifies JWT token
   */
  protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      req.user = { id: decoded.id, role: decoded.role };

      // Verify user exists in database
      const user = await db.User.findByPk(req.user.id);
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid user.' });
        return;
      }

      // Update role from database (for security)
      req.user.role = user.role;
      
      next();
    } catch (error) {
      res.status(403).json({ success: false, message: 'Invalid token.' });
    }
  };

  /**
   * Middleware for role-based authorization
   */
  authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ 
          success: false, 
          message: `Role ${req.user?.role || 'unknown'} is not authorized to access this resource.` 
        });
        return;
      }
      next();
    };
  };

  /**
   * Generate JWT access token
   */
  generateToken(id: number, role: string): string {
    return jwt.sign({ id, role }, this.jwtSecret, {
      expiresIn: '1d',
    });
  }

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(id: number, role: string): string {
    return jwt.sign({ id, role }, this.refreshSecret, {
      expiresIn: '7d',
    });
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.refreshSecret);
  }
}

// Create and export a singleton instance
export const authMiddleware = new AuthMiddleware();

// Export method references for backward compatibility
export const protect = authMiddleware.protect;
export const authorizeRole = authMiddleware.authorizeRoles;
export const generateToken = authMiddleware.generateToken.bind(authMiddleware);
export const generateRefreshToken = authMiddleware.generateRefreshToken.bind(authMiddleware);