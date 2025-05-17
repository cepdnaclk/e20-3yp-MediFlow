require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = require('../models/User');

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
      
      console.log('✅ Admin user created successfully:', adminUser.username);
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
      
      console.log('✅ Doctor user created successfully:', doctorUser.username);
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
      
      console.log('✅ Pharmacist user created successfully:', pharmacistUser.username);
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
seedDb()