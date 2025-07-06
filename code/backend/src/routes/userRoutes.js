const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const Pharmacist = require("../models/Pharmacist");
const authMiddleware = require("../middleware/authMiddleware");

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with basic info - only select fields that actually exist in User model
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'role']
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Add role-specific information
    if (user.role === 'admin') {
        const admin = await Admin.findOne({ 
            where: { userId: userId }
        });
        
        if (admin) {
            user.dataValues.admin = admin;
            // Add the name to the main user object for convenience
            user.dataValues.firstName = admin.firstName;
            user.dataValues.lastName = admin.lastName;
            
            // Add permissions directly to the user object for easier access in frontend
            user.dataValues.permissions = admin.permissions;
            user.dataValues.profilePhoto = admin.photo;
        }
        } else if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({
        where: { userId: userId }
      });
      
      if (doctor) {
        user.dataValues.doctor = doctor;
        // Add the name to the main user object for convenience
        user.dataValues.firstName = doctor.firstName;
        user.dataValues.lastName = doctor.lastName;
        user.dataValues.specialization = doctor.specialization;
        user.dataValues.profilePhoto = doctor.profileImage;
      }
    } else if (user.role === 'pharmacist') {
      const pharmacist = await Pharmacist.findOne({
        where: { userId: userId }
      });
      
      if (pharmacist) {
        user.dataValues.pharmacist = pharmacist;
        // Add the name to the main user object for convenience
        user.dataValues.firstName = pharmacist.firstName;
        user.dataValues.lastName = pharmacist.lastName;
        user.dataValues.profilePhoto = pharmacist.profileImage;
      }
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
});

module.exports = router;