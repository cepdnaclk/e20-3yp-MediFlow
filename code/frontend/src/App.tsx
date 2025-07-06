import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';
import PharmacistDashboard from './Pharmacist/PharmacistDashboard.js';
import DispenserDashboard from './Pharmacist/DispenserDashboard';
import Login_window from './Login_window';
import MediFlowNavbar from './MediFlowNavBar.js';
import RFIDScanPage from './Doctor/Rfid_scan.js';
import PatientProfile from './Doctor/Patient_Profile.js';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DoctorDashboardHeader from './Doctor/Doctor_DashboardHeader.js';
import PharmacistPrescription from './Pharmacist/Pharmacist_prescription.js';
import PatientRecords from './Doctor/All_patient_records.js';
import PatientRecordsPage from './Doctor/PatientRecordsPage.js';
import AdminDashboard from './Admin/AdminDashboard.js';
import DoctorRegistration from './Admin/DoctorRegistration';
import PatientRegistration from './Admin/PatientRegistration';
import PharmacistRegistration from './Admin/PharmacistRegistration';
import AdminRegistration from './Admin/AdminRegistration';
import ProtectedRoute from './components/ProtectedRoutes';

// Import password reset components
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordVerify from './components/ResetPasswordVerify';
import ResetPassword from './components/PasswordReset';

// AppContent component to access useLocation inside Router
const AppContent = ({ user, setUser }) => {
  const location = useLocation();
  
  // Don't show navbar on login pages and reset password pages
  const hideNavbar = location.pathname === '/' || 
                     location.pathname === '/login' || 
                     location.pathname === '/reset-password' ||
                     location.pathname === '/forgot-password' ||
                     location.pathname.startsWith('/password-reset/');
  
  return (
    <>
      {/* Conditionally render the navbar with the user role */}
      {!hideNavbar && <MediFlowNavbar userRole={user?.role || 'doctor'} />}
      
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login_window setUser={setUser} />} />
        <Route path="/login" element={<Login_window setUser={setUser} />} />

        {/* Password Reset Routes */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<ResetPasswordVerify />} />

        {/* Protected Pharmacist Routes */}
        <Route 
          path="/pharm_dashboard" 
          element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pharmacist_prescription" 
          element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <PharmacistPrescription />
            </ProtectedRoute>
          } 
        />

        {/* Protected Doctor Routes */}
        <Route 
          path="/doc_dashboard" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <>
                <DoctorDashboardHeader user={user} />
                <PatientRecords />
              </>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <RFIDScanPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/patient-records" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientRecordsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/patient-profile/:patientId" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <PatientProfile />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin_dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/register-patient" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PatientRegistration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/register-doctor" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DoctorRegistration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/register-pharmacist" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PharmacistRegistration />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/register-admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRegistration />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Pharmacist Routes - Dispensers */}
        <Route 
          path="/dispensers" 
          element={
            <ProtectedRoute allowedRoles={['pharmacist']}>
              <DispenserDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Not Found - catch-all route */}
        <Route 
          path="*" 
          element={
            user 
              ? <Navigate to={
                  user.role === 'doctor' 
                    ? '/doc_dashboard' 
                    : user.role === 'admin'
                      ? '/admin_dashboard'
                      : '/pharm_dashboard'
                } /> 
              : <Navigate to="/login" />
          } 
        />
      </Routes>
    </>
  );
};

function App() {
  // The user state will be populated with data from JSON Server, including the role
  const [user, setUser] = useState(() => {
    // Retrieve user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save user to localStorage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}

export default App;