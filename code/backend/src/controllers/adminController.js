const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Pharmacist = require('../models/Pharmacist');
const Patient = require('../models/Patient');
const { Op } = require('sequelize');

// Get total users count
exports.getUsersCount = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        role: {
          [Op.in]: ['doctor', 'pharmacist', 'admin']
        }
      }
    });
    
    res.json({
      success: true,
      count,
      totalUsers: count
    });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users count',
      error: error.message
    });
  }
};

// Get active doctors count
exports.getDoctorsCount = async (req, res) => {
  try {
    const count = await Doctor.count({
      include: [{
        model: User,
        where: {
          role: 'doctor'
        }
      }]
    });
    
    res.json({
      success: true,
      count,
      totalDoctors: count
    });
  } catch (error) {
    console.error('Error fetching doctors count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors count',
      error: error.message
    });
  }
};

// Get active pharmacists count
exports.getPharmacistsCount = async (req, res) => {
  try {
    const count = await Pharmacist.count({
      include: [{
        model: User,
        where: {
          role: 'pharmacist'
        }
      }]
    });
    
    res.json({
      success: true,
      count,
      totalPharmacists: count
    });
  } catch (error) {
    console.error('Error fetching pharmacists count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pharmacists count',
      error: error.message
    });
  }
};

// Get total patients count
exports.getPatientsCount = async (req, res) => {
  try {
    const count = await Patient.count({
      where: {
        cardStatus: 'active' // Only count active patients
      }
    });
    
    res.json({
      success: true,
      count,
      totalPatients: count
    });
  } catch (error) {
    console.error('Error fetching patients count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients count',
      error: error.message
    });
  }
};

// Get admin users count
exports.getAdminsCount = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        role: 'admin'
      }
    });
    
    res.json({
      success: true,
      count,
      totalAdmins: count
    });
  } catch (error) {
    console.error('Error fetching admins count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins count',
      error: error.message
    });
  }
};

// Get dashboard statistics (all counts in one request) - OPTIMIZED ENDPOINT
exports.getDashboardStats = async (req, res) => {
  try {
    // Get all counts in parallel for better performance
    const [usersCount, doctorsCount, pharmacistsCount, patientsCount, adminsCount] = await Promise.all([
      User.count({
        where: {
          role: {
            [Op.in]: ['doctor', 'pharmacist', 'admin']
          }
        }
      }),
      Doctor.count({
        include: [{
          model: User,
          where: {
            role: 'doctor'
          }
        }]
      }),
      Pharmacist.count({
        include: [{
          model: User,
          where: {
            role: 'pharmacist'
          }
        }]
      }),
      Patient.count({
        where: {
          cardStatus: 'active'
        }
      }),
      User.count({
        where: {
          role: 'admin'
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: usersCount,
        activeDoctors: doctorsCount,
        activePharmacists: pharmacistsCount,
        totalPatients: patientsCount,
        activeAdmins: adminsCount
      },
      message: 'Dashboard statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message,
      data: {
        totalUsers: 0,
        activeDoctors: 0,
        activePharmacists: 0,
        totalPatients: 0,
        activeAdmins: 0
      }
    });
  }
};