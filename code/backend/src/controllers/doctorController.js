const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get patients for a specific doctor
exports.getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id; // From auth middleware
    
    // Get unique patients who have prescriptions from this doctor
    const prescriptions = await Prescription.findAll({
      where: { doctorId },
      include: [{
        model: Patient,
        attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'allergies', 'medicalConditions', 'photo', 'rfidCardUID']
      }],
      order: [['createdAt', 'DESC']]
    });

    // Get unique patients with their latest prescription info
    const patientsMap = new Map();
    
    prescriptions.forEach(prescription => {
      const patient = prescription.Patient;
      const patientId = patient.id;
      
      if (!patientsMap.has(patientId)) {
        patientsMap.set(patientId, {
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          age: patient.getAge(),
          gender: patient.gender,
          phone: patient.phone,
          allergies: patient.allergies,
          medicalConditions: patient.medicalConditions,
          photo: patient.photo,
          rfidCardUID: patient.rfidCardUID,
          lastVisit: prescription.prescriptionDate,
          lastDiagnosis: prescription.diagnosis,
          lastStatus: prescription.patientStatus,
          totalVisits: 1,
          latestPrescriptionId: prescription.id
        });
      } else {
        // Update visit count
        patientsMap.get(patientId).totalVisits++;
      }
    });

    const patients = Array.from(patientsMap.values());

    res.json({
      success: true,
      patients,
      totalPatients: patients.length
    });
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      error: error.message
    });
  }
};