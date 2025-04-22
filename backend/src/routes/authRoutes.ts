import express from 'express';
import { authController } from '../controller/auth/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Authentication Routes
 */

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

// Protected routes
router.post('/logout', protect, authController.logout.bind(authController));
router.get('/profile', protect, authController.getProfile.bind(authController));

export default router;