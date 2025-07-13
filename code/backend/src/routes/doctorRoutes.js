const express = require('express');
const { getDoctorPatients } = require('../controllers/doctorController');
const { getAllDoctorPatients } = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

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

const router = express.Router();

// Get patients for logged-in doctor
router.get('/patients', authMiddleware, checkRole(['doctor']), getDoctorPatients);
router.get('/patients/all', authMiddleware, checkRole(['doctor']), getAllDoctorPatients);

module.exports = router;