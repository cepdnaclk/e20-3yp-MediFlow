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

module.exports = router;