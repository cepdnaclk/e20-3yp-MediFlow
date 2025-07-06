const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admin = sequelize.define("Admin", {
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
    photo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            canRegisterPatients: false,
            canRegisterDoctors: false,
            canRegisterPharmacists: false,
            canRegisterAdmins: false
        }
    }
});

module.exports = Admin;