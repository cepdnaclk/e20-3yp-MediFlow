const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Medicine = sequelize.define("Medicine", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    genericName: { type: DataTypes.STRING },
    manufacturer: { type: DataTypes.STRING },
    strength: { type: DataTypes.STRING },
    form: { type: DataTypes.ENUM("tablet", "capsule") },
    stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    unitPrice: { type: DataTypes.DECIMAL(10, 2) },
    expiryDate: { type: DataTypes.DATEONLY },
    batchNumber: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    sideEffects: { type: DataTypes.JSON },
    contraindications: { type: DataTypes.JSON },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Medicine;