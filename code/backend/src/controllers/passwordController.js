const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto'); // Use explicit node: prefix
const { Op } = require('sequelize');
const { sendPasswordResetEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// Reset password after first login
exports.resetPassword = async (req, res) => {
    try {
        
        const { token, newPassword } = req.body; // Changed from userId to token
        
        // Validate input
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }
        
        // Verify the JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        
        // Find the user using the decoded token ID
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        
        // Check if password reset is required
        if (!user.passwordResetRequired) {
            return res.status(400).json({ message: "Password reset is not required for this user" });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user with new password and reset the flag
        await user.update({
            password: hashedPassword,
            passwordResetRequired: false
        });
        
        
        res.status(200).json({ 
            message: "Password reset successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                passwordResetRequired: false
            }
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

// Check if password reset is required
exports.checkPasswordResetRequired = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ 
            passwordResetRequired: user.passwordResetRequired 
        });
    } catch (error) {
        console.error("Error checking password reset status:", error);
        res.status(500).json({ message: "Error checking password reset status", error: error.message });
    }
};
// Handle forgot password request
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Return error instead of success message
            return res.status(404).json({ 
                status: 'error',
                error: 'user_not_found',
                message: "No account found with this email address. Please check and try again." 
            });
        }
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // Set token and expiration (1 hour from now)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        
        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/password-reset/${resetToken}`;
        
        // Send email with reset link
        await sendPasswordResetEmail(user.email, resetUrl, user.username);
        
        res.status(200).json({ 
            status: 'success',
            message: "Password reset link sent to your email address"
        });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};

// Verify reset token
exports.verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        
        // Hash the token from the URL to compare with the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        // Find user with this token and token not expired
        const user = await User.findOne({ 
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        
        // Store user ID in session for the reset page
       // req.session.resetUserId = user.id;
        
        // Token is valid, redirect to reset page
        res.status(200).json({ 
            message: "Token verified",
            userId: user.id
        });
    } catch (error) {
        console.error("Error verifying reset token:", error);
        res.status(500).json({ message: "Error verifying token", error: error.message });
    }
};

// Reset password with token
exports.resetPasswordWithToken = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }
        
        // Hash the token from the request to compare with the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        // Find user with this token and token not expired
        const user = await User.findOne({ 
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user with new password and clear reset token fields
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
            passwordResetRequired: false
        });
        
        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetting password with token:", error);
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};