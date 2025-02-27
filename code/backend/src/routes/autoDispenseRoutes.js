const express = require("express");
const { 
    getAllAutoDispense, 
    createAutoDispense, 
    updateAutoDispense, 
    deleteAutoDispense 
} = require("../controllers/autoDispenseController");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

router.get("/", authMiddleware, checkRole(["doctor", "pharmacist"]), getAllAutoDispense);
router.post("/", authMiddleware, checkRole(["pharmacist"]), createAutoDispense);
router.put("/:id", authMiddleware, checkRole(["pharmacist"]), updateAutoDispense);
router.delete("/:id", authMiddleware, checkRole(["pharmacist"]), deleteAutoDispense);

module.exports = router;