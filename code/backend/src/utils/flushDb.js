const sequelize = require('../config/db');
const User = require('../models/User');
const Prescription = require('../models/Prescription');

async function flushDb() {
    try {
        // Force sync will drop and recreate all tables
        await sequelize.sync({ force: true });
        console.log('✅ Database flushed successfully');
    } catch (error) {
        console.error('❌ Error flushing database:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

flushDb();