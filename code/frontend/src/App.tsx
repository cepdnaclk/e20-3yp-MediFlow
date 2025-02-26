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


// AppContent component to access useLocation inside Router
const AppContent = ({ user, setUser }) => {
  const location = useLocation();
  
  // Don't show navbar on login pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';
  
  return (
    <>
      {/* Conditionally render the navbar with the user role */}
      {!hideNavbar && <MediFlowNavbar userRole={user?.role || 'doctor'} />}
      
      <Routes>
        <Route path="/" element={<Login_window setUser={setUser} />} />
        <Route path="/login" element={<Login_window setUser={setUser} />} />

        {/* Protected Routes */}
        <Route 
          path="/pharm_dashboard" 
          element={
            user ? <DispenserDashboard /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/doc_dashboard" 
          element={
            user ? (
              <>
                <DoctorDashboardHeader user={user} />
                <PatientRecords  />
              </>
            ) : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/profile" 
          element={
            user ? <PatientProfile /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/pharmacist_prescription" 
          element={
            user ? <PharmacistPrescription /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/scan" 
          element={
            user ? <RFIDScanPage /> : <Navigate to="/login" />
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