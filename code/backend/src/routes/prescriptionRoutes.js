const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole'); // Fixed import path

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

// Your existing routes
router.post('/', authMiddleware, checkRole(['doctor']), prescriptionController.createPrescription);
router.get('/', authMiddleware, checkRole(['doctor', 'pharmacist']), prescriptionController.getPrescriptions);
router.put('/:prescriptionId/status', authMiddleware, checkRole(['pharmacist']), prescriptionController.updatePrescriptionStatus);
router.get('/today', authMiddleware, checkRole(['pharmacist']), prescriptionController.getTodaysPrescriptions);

// New route for patient prescriptions
router.get("/patient/:patientId", authMiddleware, checkRole(["doctor", "pharmacist"]), prescriptionController.getPatientPrescriptions);

module.exports = router;