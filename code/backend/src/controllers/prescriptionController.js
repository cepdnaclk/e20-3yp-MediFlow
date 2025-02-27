const Prescription = require("../models/Prescription");

// Create Prescription
exports.createPrescription = async (req, res) => {
    try {
        const { patientId, patientName, age, allergies, diagnosis, prescriptionDate, medications } = req.body;
        const doctorId = req.user.id; // Get doctor ID from JWT

        const prescription = await Prescription.create({
            patientId,
            patientName,
            age,
            doctorId,
            allergies,
            diagnosis,
            prescriptionDate,
            medications
        });

        res.status(201).json({ message: "Prescription created", prescription });
    } catch (error) {
        res.status(500).json({ message: "Error creating prescription", error: error.message });
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
