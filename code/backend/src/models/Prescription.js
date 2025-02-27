const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Prescription = sequelize.define("Prescription", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.STRING, allowNull: false },
    patientName: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    doctorId: { type: DataTypes.UUID, allowNull: false },
    allergies: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    diagnosis: { type: DataTypes.STRING },
    prescriptionDate: { type: DataTypes.STRING },
    medications: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isMedicationList(value) {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new Error('Medications must be a non-empty array');
                }
            }
        }
    },
    status: { type: DataTypes.ENUM("pending", "dispensed"), defaultValue: "pending" }
});

module.exports = Prescription;