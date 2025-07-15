const express = require("express");
const { registerPatient, getAllPatients, getPatientById, getPatientByRFID } = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const { uploadPatientPhoto , getPatientPhoto } = require("../config/s3.config");
const Patient = require('../models/Patient');

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

router.get("/rfid/:uid", authMiddleware, checkRole(["admin", "doctor", "pharmacist"]), getPatientByRFID);

module.exports = router;