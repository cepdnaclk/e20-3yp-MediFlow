const express = require("express");
const { getAIResponse } = require("../controllers/AIController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Define the endpoint for AI assistance
router.get("/:patientId", authMiddleware, getAIResponse);

module.exports = router;