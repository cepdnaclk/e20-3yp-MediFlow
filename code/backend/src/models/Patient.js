const { DataTypes } = require("sequelize");
const sequelize = process.env.NODE_ENV === 'test'
    ? require('../tests/config/test-db.config')
    : require('../config/db');

const Patient = sequelize.define("Patient", {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    firstName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    lastName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    dateOfBirth: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
    },
    nic: { 
        type: DataTypes.STRING 
    },
    gender: { 
        type: DataTypes.ENUM("male", "female", "other"), 
        defaultValue: "male" 
    },
    email: { 
        type: DataTypes.STRING 
    },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    address: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    city: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    state: { 
        type: DataTypes.STRING 
    },
    zipCode: { 
        type: DataTypes.STRING 
    },
    emergencyContactName: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    emergencyContactPhone: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    emergencyContactRelationship: { 
        type: DataTypes.STRING 
    },
    bloodType: { 
        type: DataTypes.STRING 
    },
    allergies: { 
        type: DataTypes.TEXT 
    },
    medicalConditions: { 
        type: DataTypes.TEXT 
    },
    height: { 
        type: DataTypes.FLOAT 
    },
    weight: { 
        type: DataTypes.FLOAT 
    },
    rfidCardUID: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true
    },
    cardIssueDate: { 
        type: DataTypes.DATEONLY, 
        defaultValue: DataTypes.NOW 
    },
    cardStatus: { 
        type: DataTypes.ENUM("active", "inactive", "pending"), 
        defaultValue: "active" 
    },
    photo: { 
        type: DataTypes.STRING, 
        allowNull: true 
    }
});

module.exports = Patient;