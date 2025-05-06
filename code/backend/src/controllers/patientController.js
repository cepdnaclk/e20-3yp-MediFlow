const Patient = require("../models/Patient");
const { getPatientPhoto } = require("../config/s3.config");

// Register a new patient
exports.registerPatient = async (req, res) => {
    try {
        const {
            firstName, lastName, dateOfBirth, nic, gender, email, phone,
            address, city, state, zipCode, emergencyContactName,
            emergencyContactPhone, emergencyContactRelationship,
            bloodType, allergies, medicalConditions,
            height, weight, rfidCardUID, cardIssueDate, cardStatus
        } = req.body;

        // Check if rfidCardUID is already in use
        const existingCard = await Patient.findOne({ where: { rfidCardUID } });
        if (existingCard) {
            return res.status(400).json({ 
                message: "This RFID card is already registered to another patient" 
            });
        }

        // Get the photo URL from S3 upload (if any)
        const photoUrl = req.file ? req.file.location : null;

        // Create new patient
        const patient = await Patient.create({
            firstName,
            lastName,
            dateOfBirth,
            nic,
            gender,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            emergencyContactName,
            emergencyContactPhone,
            emergencyContactRelationship,
            bloodType,
            allergies,
            medicalConditions,
            height,
            weight,
            rfidCardUID,
            cardIssueDate,
            cardStatus,
            photo: photoUrl
        });

        res.status(201).json({ 
            success: true,
            message: "Patient registered successfully", 
            patient: {
                id: patient.id,
                fullName: `${patient.firstName} ${patient.lastName}`,
                rfidCardUID: patient.rfidCardUID,
                photoUrl: patient.photo
            }
        });
    } catch (error) {
        console.error("Error registering patient:", error);
        res.status(500).json({ 
            success: false,
            message: "Error registering patient", 
            error: error.message 
        });
    }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            attributes: { exclude: ['photo'] } // Exclude photo to reduce response size
        });
        res.json({ patients });
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients", error: error.message });
    }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByPk(id);
        
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const expirationTimes = {
                'admin': 1800,   // 30 minutes
                'doctor': 1200,  // 20 minutes
                'nurse': 900,    // 15 minutes
                'default': 600   // 10 minutes
              };
              
        const expireTime = expirationTimes[req.user?.role] || expirationTimes.default;
        
        // Use the utility function to get the signed URL
        const photoData = await getPatientPhoto(patient.photo, expireTime);

        const patientData = patient.toJSON();
        patientData.photo = photoData.url;
        
        res.json({ patientData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching patient", error: error.message });
    }
};