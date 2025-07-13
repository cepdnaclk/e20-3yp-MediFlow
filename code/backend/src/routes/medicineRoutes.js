const express = require('express');
const Medicine = require('../models/Medicine');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const rateLimit = require('express-rate-limit');


// Add a rate limiter 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." }
});


router.use(limiter);



// GET all active medicines
router.get('/', authMiddleware, async (req, res) => {
    try {
        const medicines = await Medicine.findAll({
            where: { isActive: true },
            order: [['name', 'ASC']],
            attributes: ['id', 'name', 'genericName', 'strength', 'form', 'stockQuantity']
        });

        res.json({
            success: true,
            medicines
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medicines'
        });
    }
});

// GET medicine dosages for a specific medicine
router.get('/:medicineId/dosages', authMiddleware, async (req, res) => {
    try {
        const { medicineId } = req.params;
        
        const medicine = await Medicine.findByPk(medicineId);
        
        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: 'Medicine not found'
            });
        }

        // Return common dosages - you can customize this based on your needs
        const commonDosages = ['250mg', '500mg', '1000mg', '5mg', '10mg', '25mg', '50mg'];
        
        res.json({
            success: true,
            dosages: commonDosages,
            medicine: {
                id: medicine.id,
                name: medicine.name,
                strength: medicine.strength
            }
        });
    } catch (error) {
        console.error('Error fetching medicine dosages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medicine dosages'
        });
    }
});

module.exports = router;