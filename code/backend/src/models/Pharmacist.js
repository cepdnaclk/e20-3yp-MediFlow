const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Pharmacist = sequelize.define("Pharmacist", {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    firstName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    lastName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    nic: { 
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    specialization: { 
        type: DataTypes.STRING 
    },
    licenseNumber: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    },
    workExperience: { 
        type: DataTypes.INTEGER 
    },
    pharmacyName: { 
        type: DataTypes.STRING 
    },
    profileImage: { 
        type: DataTypes.STRING 
    },
    isActive: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    }
});

module.exports = Pharmacist;