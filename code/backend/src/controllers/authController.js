const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require('generate-password');
const { sendTemporaryPassword } = require('../utils/emailService');

// Register User - modify this function
exports.register = async (req, res) => {
    try {
        const { username, email, password, role, firstName, lastName } = req.body;

        console.log("Register endpoint called with:");
        console.log("Role:", role);
        console.log("Email:", email);
        console.log("Username:", username);

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        let hashedPassword;
        let tempPassword = password;
        let passwordResetRequired = false;

        // For doctors, generate a temporary password and require reset
        if (role === 'doctor') {
            // Generate random password
            tempPassword = generator.generate({
                length: 10,
                numbers: true,
                symbols: true,
                uppercase: true,
                strict: true
            });
            console.log("Temporary password generated:", tempPassword);

            
            // Send email with temporary password
            try {
                await sendTemporaryPassword(email, tempPassword, `${firstName} ${lastName}`);
                passwordResetRequired = true;
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
                return res.status(500).json({ 
                    message: "Error sending email with temporary password",
                    error: emailError.message
                });
            }
        }

        // Hash password
        hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create user
        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            role,
            passwordResetRequired
        });

        res.status(201).json({ 
            message: role === 'doctor' ? 
                "User registered. Temporary password sent to email" : 
                "User registered", 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login User - modify this function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                passwordResetRequired: user.passwordResetRequired
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

