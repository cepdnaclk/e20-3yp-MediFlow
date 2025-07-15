const Prescription = require("../models/Prescription");
const { Op } = require('sequelize');

// Create Prescription
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, patientName, age, allergies, diagnosis, prescriptionDate, medicines, patientStatus, doctorComments, } = req.body;
        const doctorId = req.user.id; // Get doctor ID from JWT

        const prescription = await Prescription.create({
            patientId,
            patientName,
            age,
            doctorId,
            allergies,
            diagnosis,
            prescriptionDate,
            medicines,
            patientStatus,
            doctorComments,
        });

        res.status(201).json({ message: "Prescription created", prescription });
    } catch (error) {
        res.status(500).json({ message: "Error creating prescription", error: error.message });
    }
};

exports.getPatientPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;


        // Validate that patientId is available
        if (!patientId) {
            return res.status(400).json({ message: "Patient ID is required" });
        }

        const prescriptions = await Prescription.findAll({
            where: { patientId },
            order: [['createdAt', 'DESC']] // Most recent first
        });


        res.json({
            success: true,
            prescriptions
        });
    } catch (error) {
        console.error("Error in getPatientPrescriptions:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching patient prescriptions",
            error: error.message
        });
    }
};

// Get Prescriptions for a Doctor/Pharmacist
exports.getPrescriptions = async (req, res) => {
    try {
        let prescriptions;

        if (req.user.role === 'doctor') {
            // Doctors see their own prescriptions
            prescriptions = await Prescription.findAll({
                where: { doctorId: req.user.id }
            });
        } else if (req.user.role === 'pharmacist') {
            // Pharmacists see all pending prescriptions
            prescriptions = await Prescription.findAll({
                where: { status: 'pending' }
            });
        }

        res.json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching prescriptions", error: error.message });
    }
};

// Add method for pharmacists to update prescription status
exports.updatePrescriptionStatus = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { status } = req.body;

        const prescription = await Prescription.findByPk(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        prescription.status = status;
        await prescription.save();

        res.json({ message: "Prescription updated", prescription });
    } catch (error) {
        res.status(500).json({ message: "Error updating prescription", error: error.message });
    }
};

exports.getTodaysPrescriptions = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const prescriptions = await Prescription.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });
    res.json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching today's prescriptions", error: error.message });
  }
};