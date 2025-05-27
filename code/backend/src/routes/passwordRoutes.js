const express = require('express');
const { resetPassword, checkPasswordResetRequired } = require('../controllers/passwordController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Reset password after first login
router.post('/reset', authMiddleware, resetPassword);

// Check if password reset is required
router.get('/reset-required', authMiddleware, checkPasswordResetRequired);

module.exports = router;