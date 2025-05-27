require('dotenv').config();
const sequelize = require('../config/db');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine');

async function seedPrescriptions() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Get doctor ID (we need a valid doctor ID for prescriptions)
    const doctor = await User.findOne({
      where: { email: 'doctor@example.com', role: 'doctor' }
    });

    if (!doctor) {
      console.error('❌ Doctor user not found. Please run seedDb.js first.');
      return;
    }

    const doctorId = doctor.id;
    console.log(`ℹ️ Using doctor ID: ${doctorId}`);

    // Get existing patients
    const patients = await Patient.findAll({ limit: 3 });

    if (patients.length === 0) {
      console.error('❌ No patients found in database. Please run patientSeeder.js first.');
      return;
    }

    // Get actual medicine IDs from the database
    const cetirizine = await Medicine.findOne({ 
      where: { name: 'Cetirizine', strength: '10mg' } 
    });
    const amoxicillin = await Medicine.findOne({ 
      where: { name: 'Amoxicillin', strength: '500mg' } 
    });
    const metformin = await Medicine.findOne({ 
      where: { name: 'Metformin', strength: '500mg' } 
    });
    const lisinopril = await Medicine.findOne({ 
      where: { name: 'Lisinopril', strength: '10mg' } 
    });
    const ibuprofen = await Medicine.findOne({ 
      where: { name: 'Ibuprofen', strength: '400mg' } 
    });
    const atorvastatin = await Medicine.findOne({ 
      where: { name: 'Atorvastatin', strength: '20mg' } 
    });

    // Sample medicine lists for prescriptions
    const medicineSets = [
      [
        {
          id: amoxicillin.id,
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
          quantity: 21
        },
        {
          id: ibuprofen.id,
          name: "Ibuprofen",
          dosage: "400mg",
          frequency: "Twice daily",
          duration: "5 days",
          quantity: 10
        }
      ],
      [
        {
          id: metformin.id,
          name: "Metformin",
          dosage: "1000mg",
          frequency: "Twice daily",
          duration: "1 month",
          quantity: 60
        }
      ],
      [
        {
          id: lisinopril.id,
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30
        },
        {
          id: atorvastatin.id,
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30
        }
      ],
      [
        {
          id: cetirizine.id,
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "3 days",
          quantity: 3
        }
      ]
    ];

    // Sample patient status values
    const patientStatusOptions = [
      "Stable",
      "Improving",
      "Needs follow-up",
      "Critical",
      "Recovering",
      "Under observation",
      "Deteriorating",
      "Responding to treatment"
    ];

    // Sample doctor comments
    const doctorCommentsOptions = [
      "Patient should drink plenty of fluids and rest.",
      "Follow up in 2 weeks to reassess medicine effectiveness.",
      "Consider physical therapy if symptoms persist beyond 10 days.",
      "Blood pressure still higher than optimal, continue monitoring at home.",
      "Patient reports improvement in symptoms since last visit.",
      "Patient allergic to penicillin, prescribed alternative antibiotic.",
      "Patient advised on lifestyle modifications including diet and exercise.",
      "Patient experiencing side effects from previous medicine, switched to alternative.",
    ];

    // Sample diagnoses
    const diagnoses = [
      "Upper Respiratory Infection",
      "Type 2 Diabetes",
      "Hypertension",
      "Seasonal Allergies",
      "Acute Bronchitis",
      "Common Cold",
      "Influenza",
      "Urinary Tract Infection"
    ];

    // Create multiple prescriptions for each patient
    for (const patient of patients) {
      console.log(`Creating prescriptions for patient: ${patient.firstName} ${patient.lastName}`);

      // Get patient age
      const age = patient.getAge();

      // Create 2-4 prescriptions for each patient with different dates
      const numPrescriptions = Math.floor(Math.random() * 3) + 2; // 2-4 prescriptions

      for (let i = 0; i < numPrescriptions; i++) {
        // Create prescription date (past dates for history)
        const date = new Date();
        date.setMonth(date.getMonth() - i); // Each prescription is a month apart
        const prescriptionDate = date.toISOString().split('T')[0];

        // Select random medicine set and diagnosis
        const medicines = medicineSets[Math.floor(Math.random() * medicineSets.length)];
        const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
        const patientStatus = patientStatusOptions[Math.floor(Math.random() * patientStatusOptions.length)];
        const doctorComments = doctorCommentsOptions[Math.floor(Math.random() * doctorCommentsOptions.length)];

        // Create the prescription
        const prescription = await Prescription.create({
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          age: age,
          doctorId: doctorId,
          allergies: patient.allergies ? patient.allergies.split(',').map(a => a.trim()) : [],
          diagnosis: diagnosis,
          prescriptionDate: prescriptionDate,
          medicines: medicines,
          patientStatus: patientStatus,
          doctorComments: doctorComments,
          // Give a mix of pending and dispensed prescriptions
          status: i === 0 ? "pending" : "dispensed"
        });
        console.log(`✅ Created prescription: ${prescription.id}, Date: ${prescriptionDate}, Diagnosis: ${diagnosis}`);
      }
    }

    console.log('✅ Prescription seeding completed successfully');

  } catch (error) {
    console.error('❌ Error seeding prescriptions:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seed function
seedPrescriptions();