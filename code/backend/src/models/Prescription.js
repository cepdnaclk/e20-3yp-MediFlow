const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Prescription = sequelize.define("Prescription", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.UUID, allowNull: false },
    patientName: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    doctorId: { type: DataTypes.UUID, allowNull: false },
    allergies: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    patientStatus: {
        type: DataTypes.STRING,
        allowNull: true
    },
    doctorComments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    diagnosis: { type: DataTypes.STRING },
    prescriptionDate: { type: DataTypes.STRING },
    medicines: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            ismedicineList(value) {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new Error('medicines must be a non-empty array');
                }
            }
        }
    },
    status: { type: DataTypes.ENUM("pending", "dispensed"), defaultValue: "pending" }
});

module.exports = Prescription;