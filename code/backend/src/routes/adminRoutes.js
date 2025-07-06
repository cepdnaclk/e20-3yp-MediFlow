const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');


// Combined dashboard stats endpoint (RECOMMENDED)
router.get('/dashboard/stats', authMiddleware, checkRole(['admin']), adminController.getDashboardStats);

module.exports = router;