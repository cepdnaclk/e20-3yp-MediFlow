const express = require('express');
const { 
    resetPassword, 
    checkPasswordResetRequired, 
    forgotPassword,
    verifyResetToken,
    resetPasswordWithToken
} = require('../controllers/passwordController');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

const router = express.Router();

// Reset password after first login (requires authentication)
router.post('/reset', authMiddleware, resetPassword);

// Check if password reset is required (requires authentication)
router.get('/reset-required', authMiddleware, checkPasswordResetRequired);

// Forgot password (public route)
router.post('/forgot', forgotPassword);

// Verify reset token (public route)
router.get('/verify-token/:token', verifyResetToken);

// Reset password with token (public route)
router.post('/reset-with-token', resetPasswordWithToken);

module.exports = router;