const express = require("express");
const { createPrescription, getPrescriptions, updatePrescriptionStatus } = require("../controllers/prescriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

// Doctor routes
router.post("/", authMiddleware, checkRole(["doctor"]), createPrescription);

// Shared routes
router.get("/", authMiddleware, checkRole(["doctor", "pharmacist"]), getPrescriptions);

// Pharmacist routes
router.patch("/:prescriptionId/status",
    authMiddleware,
    checkRole(["pharmacist"]),
    updatePrescriptionStatus
);

module.exports = router;
