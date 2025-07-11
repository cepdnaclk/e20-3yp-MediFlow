const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');


// Combined dashboard stats endpoint (RECOMMENDED)
router.get('/dashboard/stats', authMiddleware, checkRole(['admin']), adminController.getDashboardStats);

// List all users (admin only)
router.get('/users', authMiddleware, checkRole(['admin']), adminController.listAllUsers);

// Delete user by ID (admin only)
router.delete('/users/:id', authMiddleware, checkRole(['admin']), adminController.deleteUser);

module.exports = router;