import { useState, useEffect } from 'react';
import './App.css';
import React from 'react';
import DispenserDashboard from './Pharmacist/DispenserDashboard.js';
import Login_window from './Login_window.js';
import MediFlowNavbar from './MediFlowNavBar.js';
import RFIDScanPage from './Doctor/Rfid_scan.js';
import PatientProfile from './Doctor/Patient_Profile.js';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DoctorDashboardHeader from './Doctor/Doctor_DashboardHeader.js';
import PharmacistPrescription from './Pharmacist/Pharmacist_prescription.js';
import PatientRecords from './Doctor/All_patient_records.js';
import AdminDashboard from './Admin/AdminDashboard.js';
import DoctorRegistration from './Admin/DoctorRegistration';
import PatientRegistration from './Admin/PatientRegistration';
import PharmacistRegistration from './Admin/PharmacistRegistration';
import AdminRegistration from './Admin/AdminRegistration';


// Role-based route protection component
const ProtectedRoute = ({ user, allowedRoles, children, redirectPath = "/login" }) => {
  // If user isn't logged in, redirect to login
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If user's role isn't in the allowed roles, redirect to their dashboard
  if (!allowedRoles.includes(user.role)) {
    // Redirect doctor to doc_dashboard, pharmacist to pharm_dashboard, and admin to admin_dashboard
    const defaultPath = 
      user.role === 'doctor' 
        ? '/doc_dashboard' 
        : user.role === 'admin'
          ? '/admin_dashboard'
          : '/pharmacist_prescription';
    return <Navigate to={defaultPath} replace />;
  }
  
  // User is authenticated and authorized
  return children;
};

// AppContent component to access useLocation inside Router
const AppContent = ({ user, setUser }) => {
  const location = useLocation();
  
  // Don't show navbar on login pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';
  
  // Define role-specific route access
  const doctorRoutes = ['doc_dashboard', 'profile', 'scan'];
  const pharmacistRoutes = ['pharm_dashboard', 'pharmacist_prescription'];
  const adminRoutes = ['admin_dashboard', 'user_management'];
  
  return (
    <>
      {/* Conditionally render the navbar with the user role */}
      {!hideNavbar && <MediFlowNavbar userRole={user?.role || 'doctor'} />}
      
      <Routes>
        <Route path="/" element={<Login_window setUser={setUser} />} />
        <Route path="/login" element={<Login_window setUser={setUser} />} />

        {/* Protected Pharmacist Routes */}
        <Route 
          path="/pharm_dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['pharmacist']}>
              <DispenserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pharmacist_prescription" 
          element={
            <ProtectedRoute user={user} allowedRoles={['pharmacist']}>
              <PharmacistPrescription />
            </ProtectedRoute>
          } 
        />

        {/* Protected Doctor Routes */}
        <Route 
          path="/doc_dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['doctor']}>
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
            <ProtectedRoute user={user} allowedRoles={['doctor']}>
              <PatientProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <ProtectedRoute user={user} allowedRoles={['doctor']}>
              <RFIDScanPage />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin_dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
            path="/admin/register-patient" 
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <PatientRegistration />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/register-doctor" 
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <DoctorRegistration />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/register-pharmacist" 
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <PharmacistRegistration />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/register-admin" 
            element={
              <ProtectedRoute user={user} allowedRoles={['admin']}>
                <AdminRegistration />
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
                      : '/pharmacist_prescription'
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