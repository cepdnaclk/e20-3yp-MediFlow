const express = require('express');
const { getDoctorPatients } = require('../controllers/doctorController');
const { getAllDoctorPatients } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// Get patients for logged-in doctor
router.get('/patients', authMiddleware, checkRole(['doctor']), getDoctorPatients);
router.get('/patients/all', authMiddleware, checkRole(['doctor']), getAllDoctorPatients);

module.exports = router;