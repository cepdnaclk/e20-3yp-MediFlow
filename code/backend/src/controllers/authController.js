const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Pharmacist = require("../models/Pharmacist"); // Add this import
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generator = require('generate-password');
const { sendTemporaryPassword } = require('../utils/emailService');
const { Op } = require("sequelize");

// Register User - Updated with Doctor and Pharmacist model integration
exports.register = async (req, res) => {
    try {
        const { 
            username, 
            email, 
            password, 
            role, 
            firstName, 
            lastName,
            nic,
            phone,
            specialization,
            qualifications,
            licenseNumber,
            experience,
            hospitalAffiliation,
            // Pharmacist specific fields
            workExperience,
            pharmacyName
        } = req.body;

        console.log("Register endpoint called with:");
        console.log("Role:", role);
        console.log("Email:", email);
        console.log("Username:", username);

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // For doctors, check if NIC or license number already exists
        if (role === 'doctor') {
            const existingDoctor = await Doctor.findOne({ 
                where: { 
                    [Op.or]: [
                        { nic: nic },
                        { licenseNumber: licenseNumber }
                    ]
                } 
            });
            if (existingDoctor) {
                return res.status(400).json({ 
                    message: "Doctor with this NIC or license number already exists" 
                });
            }
        }

        // For pharmacists, check if NIC or license number already exists
        if (role === 'pharmacist') {
            const existingPharmacist = await Pharmacist.findOne({ 
                where: { 
                    [Op.or]: [
                        { nic: nic },
                        { licenseNumber: licenseNumber }
                    ]
                } 
            });
            if (existingPharmacist) {
                return res.status(400).json({ 
                    message: "Pharmacist with this NIC or license number already exists" 
                });
            }
        }

        let hashedPassword;
        let tempPassword = password;
        let passwordResetRequired = false;

        // For doctors and pharmacists, generate a temporary password and require reset
        if (role === 'doctor' || role === 'pharmacist') {
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

        // If role is doctor, create doctor profile
        if (role === 'doctor') {
            await Doctor.create({
                userId: user.id,
                firstName,
                lastName,
                nic,
                phone,
                specialization,
                qualifications,
                licenseNumber,
                experience: parseInt(experience),
                hospitalAffiliation
            });
        }

        // If role is pharmacist, create pharmacist profile
        if (role === 'pharmacist') {
            await Pharmacist.create({
                userId: user.id,
                firstName,
                lastName,
                nic,
                phone,
                specialization,
                licenseNumber,
                workExperience: workExperience ? parseInt(workExperience) : null,
                pharmacyName
            });
        }

        res.status(201).json({ 
            message: (role === 'doctor' || role === 'pharmacist') ? 
                `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully. Temporary password sent to email` : 
                "User registered successfully", 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login User - keep as is for now
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