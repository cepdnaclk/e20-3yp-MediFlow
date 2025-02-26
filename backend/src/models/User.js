const { DataTypes } = require("sequelize");
const sequelize = process.env.NODE_ENV === 'test'
    ? require('../tests/config/test-db.config')
    : require('../config/db');

const User = sequelize.define("User", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("doctor", "pharmacist"), defaultValue: "doctor" },
});

module.exports = User;
