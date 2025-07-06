const express = require('express');
const { getDoctorPatients } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

// Get patients for logged-in doctor
router.get('/patients', authMiddleware, checkRole(['doctor']), getDoctorPatients);

module.exports = router;