const express = require("express");
const { registerPatient, getAllPatients, getPatientById } = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const { uploadPatientPhoto , getPatientPhoto } = require("../config/s3.config");
const Patient = require('../models/Patient');

const router = express.Router();

// Register new patient (admin access)
router.post("/", authMiddleware, checkRole(["admin"]), (req, res) => {
    uploadPatientPhoto(req, res, (err) => {
      if (err) {
        return res.status(400).json({ 
          success: false, 
          message: "Error uploading profile picture", 
          error: err.message 
        });
      }
      registerPatient(req, res);
    });
  });

// Get all patients (admin and doctor access)
router.get("/", authMiddleware, checkRole(["admin", "doctor"]), getAllPatients);

// Get patient by ID (admin, doctor, and pharmacist access)
router.get("/:id", authMiddleware, checkRole(["admin", "doctor", "pharmacist"]), getPatientById);

// Generate pre-signed URL for accessing patient photo
router.get('/:id/photo-url', authMiddleware,checkRole(["admin", "doctor"]), async (req, res) => {
    try {
      const patient = await Patient.findByPk(req.params.id);
      
      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found' });
      }
      
      if (!patient.photo) {
        return res.status(404).json({ success: false, message: 'No photo available for this patient' });
      }
      
      // Custom expiration times based on user role (optional)
      const expirationTimes = {
        'admin': 1800,   // 30 minutes
        'doctor': 1200,  // 20 minutes
        'nurse': 900,    // 15 minutes
        'default': 600   // 10 minutes
      };
      
      const expireTime = expirationTimes[req.user?.role] || expirationTimes.default;
      
      // Use the utility function to get the signed URL
      const photoData = await getPatientPhoto(patient.photo, expireTime);
      
      res.json({
        success: true,
        ...photoData
      });
    } catch (error) {
      console.error('Error fetching patient photo URL:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating access link for photo',
        error: error.message
      });
    }
  });

module.exports = router;