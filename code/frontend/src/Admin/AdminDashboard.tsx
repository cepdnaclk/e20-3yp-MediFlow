import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Hospital, Settings, Database, Shield, Activity, AlertTriangle, BarChart, UserPlus, UserCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeDoctors: 42,
    activePharmacists: 28,
    systemAlerts: 2
  });

  // Sample patient treatment data (last 7 days)
  const patientTreatmentData = [
    { day: 'Mon', patients: 28, appointments: 35 },
    { day: 'Tue', patients: 32, appointments: 37 },
    { day: 'Wed', patients: 41, appointments: 45 },
    { day: 'Thu', patients: 35, appointments: 39 },
    { day: 'Fri', patients: 45, appointments: 52 },
    { day: 'Sat', patients: 21, appointments: 25 },
    { day: 'Sun', patients: 18, appointments: 20 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      {/* Stats Cards - Made smaller and removed Pending Approvals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring' }}>
          <Card className="border-l-4 border-blue-500">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Users</p>
                  <h3 className="text-xl font-bold">{stats.totalUsers}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring' }}>
          <Card className="border-l-4 border-teal-500">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center">
                <Hospital className="h-6 w-6 text-teal-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Active Doctors</p>
                  <h3 className="text-xl font-bold">{stats.activeDoctors}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring' }}>
          <Card className="border-l-4 border-purple-500">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center">
                <Database className="h-6 w-6 text-purple-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Active Pharmacists</p>
                  <h3 className="text-xl font-bold">{stats.activePharmacists}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: 'spring' }}>
          <Card className="border-l-4 border-red-500">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <div>
                  <p className="text-xs font-medium text-gray-500">System Alerts</p>
                  <h3 className="text-xl font-bold">{stats.systemAlerts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Treatment Visualization */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              Patient Treatments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-2">
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Daily treatment statistics</span> - Last 7 days
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={patientTreatmentData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#4f46e5" 
                      fillOpacity={1} 
                      fill="url(#colorAppointments)" 
                      name="Appointments"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorPatients)" 
                      name="Patients Treated"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between items-center mt-6 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Weekly Average</span>
                  <span className="text-lg font-bold">31.4 patients</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Full Report →
                </motion.button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Updated with registration options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              User Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg flex items-center justify-between"
                onClick={() => navigate('/admin/register-patient')}
              >
                <span>Register Patients</span>
                <UserCircle className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg flex items-center justify-between"
                onClick={() => navigate('/admin/register-doctor')}
              >
                <span>Register Doctors</span>
                <Hospital className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg flex items-center justify-between"
                onClick={() => navigate('/admin/register-pharmacist')}
              >
                <span>Register Pharmacists</span>
                <Database className="h-5 w-5" />
              </motion.button>

              
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg flex items-center justify-between"
            onClick={() => navigate('/admin/register-admin')}
            >
            <span>Register Admins</span>
            <Shield className="h-5 w-5" />
            </motion.button>
              
              {/* System Settings button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg flex items-center justify-between mt-6"
              >
                <span>System Settings</span>
                <Settings className="h-5 w-5" />
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;