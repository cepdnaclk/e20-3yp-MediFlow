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