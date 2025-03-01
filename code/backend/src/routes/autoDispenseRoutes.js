const express = require("express");
const { 
    getAllAutoDispense, 
    createAutoDispense, 
    updateAutoDispense, 
    deleteAutoDispense,
    triggerAutoDispense 
} = require("../controllers/autoDispenseController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.get("/", authMiddleware, checkRole(["doctor", "pharmacist"]), getAllAutoDispense);
router.post("/", authMiddleware, checkRole(["pharmacist"]), createAutoDispense);
router.put("/:id", authMiddleware, checkRole(["pharmacist"]), updateAutoDispense);
router.delete("/:id", authMiddleware, checkRole(["pharmacist"]), deleteAutoDispense);

router.post("/trigger", authMiddleware, checkRole(["pharmacist"]), triggerAutoDispense);

module.exports = router;