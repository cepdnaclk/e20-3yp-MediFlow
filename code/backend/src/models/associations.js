const User = require('./User');
const Patient = require('./Patient');
const Prescription = require('./Prescription');
const Medicine = require('./Medicine');
const Dispenser = require('./Dispenser');
const Doctor = require('./Doctor');
const Pharmacist = require('./Pharmacist');

// User-Prescription relationships
User.hasMany(Prescription, { foreignKey: 'doctorId' });
Prescription.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Patient-Prescription relationships
Patient.hasMany(Prescription, { foreignKey: 'patientId' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId' });

// Medicine-Dispenser relationships
Medicine.hasMany(Dispenser, { foreignKey: 'medicine_id' });
Dispenser.belongsTo(Medicine, { foreignKey: 'medicine_id' });

User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Pharmacist, { foreignKey: 'userId' });
Pharmacist.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Patient,
    Prescription,
    Medicine,
    Dispenser,
    Doctor,
    Pharmacist
};