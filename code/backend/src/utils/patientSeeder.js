require('dotenv').config();
const sequelize = require('../config/db');
const Patient = require('../models/Patient');

async function seedPatients() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Test patients data with RFID UIDs
    const testPatients = [
      {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-05-15',
        phone: '0771234567',
        address: '123 Main Street',
        city: 'Colombo',
        gender: 'male',
        email: 'john.doe@example.com',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '0777654321',
        emergencyContactRelationship: 'Spouse',
        bloodType: 'O+',
        allergies: 'Penicillin',
        medicalConditions: 'Hypertension',
        height: 175,
        weight: 70,
        rfidCardUID: '0773935943', // RFID card UID for scanning
        nic: '900515123V',
        cardStatus: 'active'
      },
      {
        firstName: 'Sarah',
        lastName: 'Smith',
        dateOfBirth: '1985-08-22',
        phone: '0761234567',
        address: '456 Park Avenue',
        city: 'Kandy',
        gender: 'female',
        email: 'sarah.smith@example.com',
        emergencyContactName: 'Mike Smith',
        emergencyContactPhone: '0767654321',
        emergencyContactRelationship: 'Brother',
        bloodType: 'A-',
        allergies: 'Nuts, Shellfish',
        medicalConditions: 'Asthma',
        height: 165,
        weight: 58,
        rfidCardUID: '0088551244', // RFID card UID for scanning
        nic: '850822456V',
        cardStatus: 'active'
      }
    ];
    
    // Create patients if they don't exist
    for (const patientData of testPatients) {
      const existingPatient = await Patient.findOne({
        where: { rfidCardUID: patientData.rfidCardUID }
      });
      
      if (!existingPatient) {
        await Patient.create(patientData);
        console.log(`✅ Test patient created: ${patientData.firstName} ${patientData.lastName} with RFID: ${patientData.rfidCardUID}`);
      } else {
        console.log(`ℹ️ Patient with RFID ${patientData.rfidCardUID} already exists`);
      }
    }
    
    console.log('✅ Patient seeding completed successfully');
    
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seed function
seedPatients();