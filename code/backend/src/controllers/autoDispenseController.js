const AutoDispense = require("../models/autoDispense");
const Prescription = require("../models/Prescription");

// Get all auto dispense entries
exports.getAllAutoDispense = async (req, res) => {
    try {
        const autoDispense = await AutoDispense.findAll();
        res.json({ autoDispense });
    } catch (error) {
        res.status(500).json({ message: "Error fetching auto dispense data", error: error.message });
    }
};

// Create new auto dispense entry
exports.createAutoDispense = async (req, res) => {
    try {
        const { medicationIds } = req.body;

        if (!medicationIds || !Array.isArray(medicationIds) || medicationIds.length === 0) {
            return res.status(400).json({ message: "Valid medicationIds array is required" });
        }

        const autoDispense = await AutoDispense.create({
            medicationIds
        });

        res.status(201).json({ message: "Auto dispense created", autoDispense });
    } catch (error) {
        res.status(500).json({ message: "Error creating auto dispense", error: error.message });
    }
};

// Update auto dispense entry
exports.updateAutoDispense = async (req, res) => {
    try {
        const { id } = req.params;
        const { medicationIds } = req.body;

        if (!medicationIds || !Array.isArray(medicationIds) || medicationIds.length === 0) {
            return res.status(400).json({ message: "Valid medicationIds array is required" });
        }

        const autoDispense = await AutoDispense.findByPk(id);
        if (!autoDispense) {
            return res.status(404).json({ message: "Auto dispense entry not found" });
        }

        autoDispense.medicationIds = medicationIds;
        await autoDispense.save();

        res.json({ message: "Auto dispense updated", autoDispense });
    } catch (error) {
        res.status(500).json({ message: "Error updating auto dispense", error: error.message });
    }
};

// Delete auto dispense entry
exports.deleteAutoDispense = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await AutoDispense.destroy({ where: { id } });

        if (result === 0) {
            return res.status(404).json({ message: "Auto dispense entry not found" });
        }

        res.json({ message: "Auto dispense deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting auto dispense", error: error.message });
    }
};