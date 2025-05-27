const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Reset password after first login
exports.resetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        
        // Validate input
        if (!userId || !newPassword) {
            return res.status(400).json({ message: "User ID and new password are required" });
        }
        
        // Find the user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Make sure the user is the one making the request
        if (user.id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to reset this password" });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user with new password and reset the flag
        await user.update({
            password: hashedPassword,
            passwordResetRequired: false
        });
        
        res.status(200).json({ message: "Password reset successful" });
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