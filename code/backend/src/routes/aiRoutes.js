const express = require("express");
const { getAIResponse } = require("../controllers/AIController");
const authMiddleware = require("../middleware/authMiddleware");

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

// Define the endpoint for AI assistance
router.get("/:patientId", authMiddleware, getAIResponse);

module.exports = router;