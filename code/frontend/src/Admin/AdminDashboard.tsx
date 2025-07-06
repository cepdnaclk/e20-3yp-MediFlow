import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Hospital, Database, Shield, AlertTriangle, UserPlus, UserCircle, Loader, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card.js';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDoctors: 0,
    activePharmacists: 0,
    totalPatients: 0,
    activeAdmins: 0
  });
  
  const [adminPermissions, setAdminPermissions] = useState({
    canRegisterPatients: false,
    canRegisterDoctors: false,
    canRegisterPharmacists: false,
    canRegisterAdmins: false
  });

  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setStats({
            totalUsers: result.data.totalUsers || 0,
            activeDoctors: result.data.activeDoctors || 0,
            activePharmacists: result.data.activePharmacists || 0,
            totalPatients: result.data.totalPatients || 0,
            activeAdmins: result.data.activeAdmins || 0
          });
        } else {
          throw new Error(result.message || 'Failed to fetch dashboard stats');
        }
      } else {
        throw new Error(`HTTP error ${response.status}: Failed to fetch dashboard stats`);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalUsers: 0,
        activeDoctors: 0,
        activePharmacists: 0,
        totalPatients: 0,
        activeAdmins: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdminPermissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        try {
          const response = await fetch(`${API_URL}/api/users/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch user profile: ${response.status}`);
          }

          const userData = await response.json();
          
          if (userData.firstName && userData.lastName) {
            setAdminName(`${userData.firstName} ${userData.lastName}`);
          } else if (userData.admin && userData.admin.firstName && userData.admin.lastName) {
            setAdminName(`${userData.admin.firstName} ${userData.admin.lastName}`);
          } else if (userData.username) {
            setAdminName(userData.username);
          }
          
          if (userData.admin && userData.admin.permissions) {
            setAdminPermissions(userData.admin.permissions);
          } else {
            console.warn('Admin permissions not found in API response, using defaults');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          setAdminName(user.username || 'Admin User');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin permissions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdminPermissions();
    fetchDashboardStats();
  }, []);

  const permissionCount = Object.values(adminPermissions).filter(Boolean).length;
  const calculatedTotalUsers = stats.activeDoctors + stats.activePharmacists + stats.totalPatients;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 }
  };

  if (loading) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            duration: 1,
            ease: "easeInOut" 
          }}
          className="mx-auto mb-4 flex justify-center"
        >
          <Loader className="h-10 w-10 text-blue-600" />
        </motion.div>
        <p className="text-lg font-medium text-gray-700">Loading dashboard</p>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-r from-red-50 to-red-100 p-8 shadow-lg"
        >
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-3 text-center text-xl font-semibold text-red-800">Unable to Load Dashboard</h3>
          <p className="mb-6 text-center text-red-600">{error}</p>
          <div className="flex justify-center">
            <button 
              className="rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
                Admin Dashboard
              </h1>
              {adminName && (
                <p className="mt-1 text-gray-600">
                  Welcome back, <span className="font-medium">{adminName}</span>
                </p>
              )}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 md:mt-0"
            >
              <div className={`flex items-center rounded-full px-5 py-2.5 ${
                permissionCount > 0 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-emerald-700' 
                  : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700'
              }`}>
                {permissionCount > 0 ? (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    <span className="font-medium">
                      {permissionCount} Registration Permission{permissionCount !== 1 ? 's' : ''}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    <span className="font-medium">Limited Access</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
          className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          <motion.div variants={cardVariants} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden rounded-2xl border-none bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 p-3">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-sm font-medium text-blue-100">Total Users</p>
                    <h3 className="text-3xl font-bold text-white">
                      {statsLoading ? (
                        <div className="h-9 w-16 animate-pulse rounded-lg bg-white/30"></div>
                      ) : (
                        stats.totalUsers > 0 ? stats.totalUsers : calculatedTotalUsers
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={cardVariants} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden rounded-2xl border-none bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20 transition-all hover:shadow-xl hover:shadow-teal-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 p-3">
                    <Hospital className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-sm font-medium text-teal-100">Doctors</p>
                    <h3 className="text-3xl font-bold text-white">
                      {statsLoading ? (
                        <div className="h-9 w-16 animate-pulse rounded-lg bg-white/30"></div>
                      ) : (
                        stats.activeDoctors
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden rounded-2xl border-none bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 p-3">
                    <Database className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-sm font-medium text-purple-100">Pharmacists</p>
                    <h3 className="text-3xl font-bold text-white">
                      {statsLoading ? (
                        <div className="h-9 w-16 animate-pulse rounded-lg bg-white/30"></div>
                      ) : (
                        stats.activePharmacists
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Admin Count Card */}
          <motion.div variants={cardVariants} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden rounded-2xl border-none bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 transition-all hover:shadow-xl hover:shadow-amber-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 p-3">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-sm font-medium text-amber-100">Active Admins</p>
                    <h3 className="text-3xl font-bold text-white">
                      {statsLoading ? (
                        <div className="h-9 w-16 animate-pulse rounded-lg bg-white/30"></div>
                      ) : (
                        stats.activeAdmins 
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          {/* Patient Count Card */}
          <motion.div variants={cardVariants} transition={{ duration: 0.3 }}>
            <Card className="overflow-hidden rounded-2xl border-none bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20 transition-all hover:shadow-xl hover:shadow-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/20 p-3">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-sm font-medium text-green-100">Total Patients</p>
                    <h3 className="text-3xl font-bold text-white">
                      {statsLoading ? (
                        <div className="h-9 w-16 animate-pulse rounded-lg bg-white/30"></div>
                      ) : (
                        stats.totalPatients
                      )}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
        </motion.div>

        {/* User Registration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5">
              <CardTitle className="flex items-center text-xl text-gray-800">
                <UserPlus className="mr-2 h-5 w-5 text-blue-600" />
                User Registration
              </CardTitle>
              {permissionCount === 0 && (
                <CardDescription className="flex items-center text-amber-600">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Limited permissions
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-5">
                {/* Registration Buttons */}
                {adminPermissions.canRegisterPatients && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 text-blue-700 shadow-sm transition-all hover:shadow-md"
                    onClick={() => navigate('/admin/register-patient')}
                  >
                    <span className="font-medium">Register Patients</span>
                    <div className="rounded-full bg-blue-200 p-2">
                      <UserCircle className="h-5 w-5" />
                    </div>
                  </motion.button>
                )}
                
                {adminPermissions.canRegisterDoctors && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center justify-between rounded-xl bg-gradient-to-r from-teal-50 to-teal-100 px-6 py-4 text-teal-700 shadow-sm transition-all hover:shadow-md"
                    onClick={() => navigate('/admin/register-doctor')}
                  >
                    <span className="font-medium">Register Doctors</span>
                    <div className="rounded-full bg-teal-200 p-2">
                      <Hospital className="h-5 w-5" />
                    </div>
                  </motion.button>
                )}
                
                {adminPermissions.canRegisterPharmacists && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 text-purple-700 shadow-sm transition-all hover:shadow-md"
                    onClick={() => navigate('/admin/register-pharmacist')}
                  >
                    <span className="font-medium">Register Pharmacists</span>
                    <div className="rounded-full bg-purple-200 p-2">
                      <Database className="h-5 w-5" />
                    </div>
                  </motion.button>
                )}
                
                {adminPermissions.canRegisterAdmins && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="flex items-center justify-between rounded-xl bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 text-red-700 shadow-sm transition-all hover:shadow-md"
                    onClick={() => navigate('/admin/register-admin')}
                  >
                    <span className="font-medium">Register Admins</span>
                    <div className="rounded-full bg-red-200 p-2">
                      <Shield className="h-5 w-5" />
                    </div>
                  </motion.button>
                )}
                
                {/* No permissions message */}
                {!adminPermissions.canRegisterPatients && 
                 !adminPermissions.canRegisterDoctors && 
                 !adminPermissions.canRegisterPharmacists && 
                 !adminPermissions.canRegisterAdmins && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                      <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">No Registration Permissions</h3>
                    <p className="mb-3 text-gray-600">You don't have permission to register new users.</p>
                    <p className="text-sm text-gray-500">Contact your system administrator for access.</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;