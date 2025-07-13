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