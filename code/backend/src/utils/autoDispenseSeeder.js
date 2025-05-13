require('dotenv').config();
const sequelize = require('../config/db');
const AutoDispense = require('../models/autoDispense');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

async function seedAutoDispense() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sample auto-dispense entries
    const autoDispenseEntries = [
     
      {
        // Combined entry with both medication IDs
        id: uuidv4(),
        medicationIds: [1,2]
      }
    ];

    // Create entries in the database without checking for duplicates first
    // This is a simpler approach since JSON comparison in PostgreSQL is complex
    for (const entry of autoDispenseEntries) {
      try {
        const newEntry = await AutoDispense.create(entry);
        console.log(`✅ Created auto-dispense entry with medications: ${entry.medicationIds.join(', ')}`);
      } catch (err) {
        // If there's a unique constraint violation, log and continue
        if (err.name === 'SequelizeUniqueConstraintError') {
          console.log(`ℹ️ Auto-dispense entry with medications ${entry.medicationIds.join(', ')} already exists`);
        } else {
          throw err; // Re-throw other errors
        }
      }
    }

    console.log('✅ Auto-dispense seeding completed successfully');

  } catch (error) {
    console.error('❌ Error seeding auto-dispense data:', error);
  } finally {
    // Close database connection
    await sequelize.close();
    process.exit(0);
  }
}

// Run the seed function
seedAutoDispense();