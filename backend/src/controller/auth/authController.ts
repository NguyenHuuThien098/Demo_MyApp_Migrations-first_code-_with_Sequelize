import { Request, Response } from 'express';
import { authService } from '../../services/authService';

/**
 * Controller class for authentication endpoints
 * Handles HTTP requests related to authentication and delegates business logic to AuthService
 */
export class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, fullName } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'Please provide username, email and password' });
        return;
      }

      const userData = await authService.register({ username, email, password, fullName });

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          token: userData.token
        }
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ success: false, message: 'Please provide username/email and password' });
        return;
      }

      const userData = await authService.login({ username, password });

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          token: userData.token
        }
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      await authService.logout(req.user.id);

      // Clear the refresh token cookie
      res.clearCookie('refreshToken');

      res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'An error occurred during logout' });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token not found' });
        return;
      }

      const tokens = await authService.refreshToken(refreshToken);

      // Set new refresh token in HttpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: { token: tokens.token }
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const profileData = await authService.getUserProfile(req.user.id);

      res.status(200).json({ success: true, data: profileData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: 'An error occurred while fetching user profile' });
    }
  }
}

// Export singleton instance
export const authController = new AuthController();