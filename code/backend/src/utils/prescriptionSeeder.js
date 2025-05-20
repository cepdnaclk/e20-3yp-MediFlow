require('dotenv').config();
const sequelize = require('../config/db');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { v4: uuidv4 } = require('uuid');

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
    
    // Sample medication lists for prescriptions
    const medicationSets = [
      [
        {
          id: uuidv4(),
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
          quantity: 21
        },
        {
          id: uuidv4(),
          name: "Ibuprofen",
          dosage: "400mg",
          frequency: "Twice daily",
          duration: "5 days",
          quantity: 10
        }
      ],
      [
        {
          id: uuidv4(),
          name: "Metformin",
          dosage: "1000mg",
          frequency: "Twice daily",
          duration: "1 month",
          quantity: 60
        }
      ],
      [
        {
          id: uuidv4(),
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30
        },
        {
          id: uuidv4(),
          name: "Atorvastatin",
          dosage: "20mg",
          frequency: "Once daily",
          duration: "1 month",
          quantity: 30
        }
      ],
      [
        {
          id: uuidv4(),
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "3 days",
          quantity: 3
        }
      ]
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
        
        // Select random medication set and diagnosis
        const medications = medicationSets[Math.floor(Math.random() * medicationSets.length)];
        const diagnosis = diagnoses[Math.floor(Math.random() * diagnoses.length)];
        
        // Create the prescription
        const prescription = await Prescription.create({
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          age: age,
          doctorId: doctorId,
          allergies: patient.allergies ? patient.allergies.split(',').map(a => a.trim()) : [],
          diagnosis: diagnosis,
          prescriptionDate: prescriptionDate,
          medications: medications,
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