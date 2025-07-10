require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');

// Base URL for images (adjust based on your environment)
const BASE_URL = process.env.API_URL;

async function seedDb() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@example.com' }
    });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create admin user
      const adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      // Create corresponding admin record with all permissions
      await Admin.create({
        userId: adminUser.id,
        firstName: 'System',
        lastName: 'Administrator',
        nic: '123456789V',
        phone: '0771234567',
        photo: `${BASE_URL}/uploads/profiles/admin.png`,  // Use your existing image
        permissions: {
          canRegisterPatients: true,
          canRegisterDoctors: true,
          canRegisterPharmacists: true,
          canRegisterAdmins: true
        }
      });
      
      console.log('✅ Admin user and admin profile created successfully:', adminUser.username);
    }
    
    // Check if doctor user already exists
    const existingDoctor = await User.findOne({
      where: { email: 'doctor@example.com' }
    });
    
    if (existingDoctor) {
      console.log('ℹ️ Doctor user already exists');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create doctor user
      const doctorUser = await User.create({
        username: 'doctor',
        email: 'doctor@example.com',
        password: hashedPassword,
        role: 'doctor'
      });
      
      // Create corresponding doctor record
      await Doctor.create({
        userId: doctorUser.id,
        firstName: 'John',
        lastName: 'Smith',
        nic: '987654321V',
        phone: '0772345678',
        profileImage: `${BASE_URL}/uploads/profiles/doctor.png`,  // Use your existing image
        specialization: 'General Medicine',
        qualifications: 'MBBS, MD',
        licenseNumber: 'DOC001',
        experience: 5,
        hospitalAffiliation: 'General Hospital'
      });
      
      console.log('✅ Doctor user and doctor profile created successfully:', doctorUser.username);
    }
    
    // Check if pharmacist user already exists
    const existingPharmacist = await User.findOne({
      where: { email: 'pharmacist@example.com' }
    });
    
    if (existingPharmacist) {
      console.log('ℹ️ Pharmacist user already exists');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create pharmacist user
      const pharmacistUser = await User.create({
        username: 'pharmacist',
        email: 'pharmacist@example.com',
        password: hashedPassword,
        role: 'pharmacist'
      });
      
      // Create corresponding pharmacist record
      await Pharmacist.create({
        userId: pharmacistUser.id,
        firstName: 'Jane',
        lastName: 'Doe',
        nic: '456789123V',
        phone: '0773456789',
        profileImage: `${BASE_URL}/uploads/profiles/pharmacist.png`,  // Use your existing image
        specialization: 'Clinical Pharmacy',
        licenseNumber: 'PHA001',
        workExperience: 3,
        pharmacyName: 'City Pharmacy'
      });
      
      console.log('✅ Pharmacist user and pharmacist profile created successfully:', pharmacistUser.username);
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seed function
seedDb();