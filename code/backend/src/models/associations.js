const User = require('./User');
const Patient = require('./Patient');
const Prescription = require('./Prescription');
const Medicine = require('./Medicine');
const Dispenser = require('./Dispenser');

// User-Prescription relationships
User.hasMany(Prescription, { foreignKey: 'doctorId' });
Prescription.belongsTo(User, { foreignKey: 'doctorId', as: 'doctor' });

// Patient-Prescription relationships
Patient.hasMany(Prescription, { foreignKey: 'patientId' });
Prescription.belongsTo(Patient, { foreignKey: 'patientId' });

// Medicine-Dispenser relationships
Medicine.hasMany(Dispenser, { foreignKey: 'medicine_id' });
Dispenser.belongsTo(Medicine, { foreignKey: 'medicine_id' });


module.exports = {
    User,
    Patient,
    Prescription,
    Medicine,
    Dispenser
};