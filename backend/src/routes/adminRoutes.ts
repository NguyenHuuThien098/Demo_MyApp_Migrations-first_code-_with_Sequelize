import express from 'express';
import { adminController } from '../controller/admin/adminController';
import { protect, authorizeRole } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * Admin Routes
 * All routes require admin role
 */

// Dashboard statistics
router.get('/dashboard', protect, authorizeRole(['admin']), adminController.getDashboardStats.bind(adminController));

// User management
router.get('/users', protect, authorizeRole(['admin']), adminController.getAllUsers.bind(adminController));
router.get('/users/:id', protect, authorizeRole(['admin']), adminController.getUserById.bind(adminController));
router.patch('/users/:id/status', protect, authorizeRole(['admin']), adminController.updateUserStatus.bind(adminController));

// Customer management (admin view)
router.get('/customers', protect, authorizeRole(['admin']), adminController.getAllCustomers.bind(adminController));

export default router;