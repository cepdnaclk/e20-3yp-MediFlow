const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Prescription = sequelize.define("Prescription", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    patientId: { type: DataTypes.STRING, allowNull: false },
    doctorId: { type: DataTypes.UUID, allowNull: false },
    medicines: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isMedicineList(value) {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new Error('Medicines must be a non-empty array');
                }
            }
        }
    },
    status: { type: DataTypes.ENUM("pending", "dispensed"), defaultValue: "pending" }
});

module.exports = Prescription;
