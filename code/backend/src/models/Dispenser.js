const { DataTypes } = require("sequelize");
const sequelize = process.env.NODE_ENV === 'test'
    ? require('../tests/config/test-db.config')
    : require('../config/db');

const Dispenser = sequelize.define("Dispenser", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    medicine_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('online', 'offline', 'dispensing', 'error', 'maintenance'),
        defaultValue: 'offline'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Dispenser;