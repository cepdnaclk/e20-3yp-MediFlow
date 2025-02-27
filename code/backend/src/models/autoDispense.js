const { DataTypes } = require("sequelize");
const sequelize = process.env.NODE_ENV === 'test'
    ? require('../tests/config/test-db.config')
    : require('../config/db');

const AutoDispense = sequelize.define("AutoDispense", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    medicationIds: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = AutoDispense;