const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole'); // Fixed import path

// Your existing routes
router.post('/', authMiddleware, checkRole(['doctor']), prescriptionController.createPrescription);
router.get('/', authMiddleware, checkRole(['doctor', 'pharmacist']), prescriptionController.getPrescriptions);
router.put('/:prescriptionId/status', authMiddleware, checkRole(['pharmacist']), prescriptionController.updatePrescriptionStatus);

// New route for patient prescriptions
router.get("/patient/:patientId", authMiddleware, checkRole(["doctor", "pharmacist"]), prescriptionController.getPatientPrescriptions);

module.exports = router;