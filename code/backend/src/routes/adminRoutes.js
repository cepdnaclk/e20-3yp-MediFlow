const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const rateLimit = require('express-rate-limit');


// Add a rate limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});


router.use(limiter);


// Combined dashboard stats endpoint (RECOMMENDED)
router.get('/dashboard/stats', authMiddleware, checkRole(['admin']), adminController.getDashboardStats);

// List all users (admin only)
router.get('/users', authMiddleware, checkRole(['admin']), adminController.listAllUsers);

// Delete user by ID (admin only)
router.delete('/users/:id', authMiddleware, checkRole(['admin']), adminController.deleteUser);

module.exports = router;