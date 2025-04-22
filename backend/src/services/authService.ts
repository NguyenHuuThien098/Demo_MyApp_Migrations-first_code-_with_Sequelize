import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middleware/authMiddleware';
import db from '../models/index';
import { Op } from 'sequelize';

/**
 * Authentication Service Class
 * Handles authentication business logic including user registration, login, logout
 */
export class AuthService {
  /**
   * Register a new user
   */
  async register(userData: { username: string; email: string; password: string; fullName?: string }) {
    const { username, email, password, fullName } = userData;

    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with 'customer' role by default
    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
      fullName: fullName || username,
      role: 'customer',
      isActive: true,
      refreshToken: null
    });

    // Create tokens
    const token = authMiddleware.generateToken(user.id, user.role);
    const refreshToken = authMiddleware.generateRefreshToken(user.id, user.role);

    // Update user with refresh token
    await user.update({ refreshToken, lastLogin: new Date() });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
      refreshToken
    };
  }

  /**
   * Login user
   */
  async login(loginData: { username: string; password: string }) {
    const { username, password } = loginData;

    // Find user by username or email
    const user = await db.User.findOne({
      where: {
        [Op.or]: [{ username }, { email: username }],
        isActive: true
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // Create tokens
    const token = authMiddleware.generateToken(user.id, user.role);
    const refreshToken = authMiddleware.generateRefreshToken(user.id, user.role);

    // Update user with refresh token and last login
    await user.update({ refreshToken, lastLogin: new Date() });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
      refreshToken
    };
  }

  /**
   * Logout user
   */
  async logout(userId: number) {
    const user = await db.User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Clear refresh token
    await user.update({ refreshToken: null });

    return true;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      // Verify refresh token
      const decoded = authMiddleware.verifyRefreshToken(refreshToken);

      // Find user by ID and refresh token
      const user = await db.User.findOne({
        where: {
          id: decoded.id,
          refreshToken,
          isActive: true
        }
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const newToken = authMiddleware.generateToken(user.id, user.role);
      const newRefreshToken = authMiddleware.generateRefreshToken(user.id, user.role);

      // Update user with new refresh token
      await user.update({ refreshToken: newRefreshToken });

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Get user profile including customer details if available
   */
  async getUserProfile(userId: number) {
    // Get user without password
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If user is a customer, get related customer data
    let customerProfile = null;
    if (user.role === 'customer') {
      customerProfile = await db.Customer.findOne({
        where: { UserId: userId }
      });
    }

    return {
      user,
      customerProfile
    };
  }
}

// Export singleton instance
export const authService = new AuthService();