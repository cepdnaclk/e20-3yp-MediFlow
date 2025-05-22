import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './App.css';
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
        return _jsx(Navigate, { to: redirectPath, replace: true });
    }
    // If user's role isn't in the allowed roles, redirect to their dashboard
    if (!allowedRoles.includes(user.role)) {
        // Redirect doctor to doc_dashboard, pharmacist to pharm_dashboard, and admin to admin_dashboard
        const defaultPath = user.role === 'doctor'
            ? '/doc_dashboard'
            : user.role === 'admin'
                ? '/admin_dashboard'
                : '/pharm_dashboard';
        return _jsx(Navigate, { to: defaultPath, replace: true });
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
    return (_jsxs(_Fragment, { children: [!hideNavbar && _jsx(MediFlowNavbar, { userRole: user?.role || 'doctor' }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Login_window, { setUser: setUser }) }), _jsx(Route, { path: "/login", element: _jsx(Login_window, { setUser: setUser }) }), _jsx(Route, { path: "/pharm_dashboard", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['pharmacist'], children: _jsx(DispenserDashboard, {}) }) }), _jsx(Route, { path: "/pharmacist_prescription", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['pharmacist'], children: _jsx(PharmacistPrescription, {}) }) }), _jsx(Route, { path: "/doc_dashboard", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['doctor'], children: _jsxs(_Fragment, { children: [_jsx(DoctorDashboardHeader, { user: user }), _jsx(PatientRecords, {})] }) }) }), _jsx(Route, { path: "/profile", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['doctor'], children: _jsx(PatientProfile, {}) }) }), _jsx(Route, { path: "/scan", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['doctor'], children: _jsx(RFIDScanPage, {}) }) }), _jsx(Route, { path: "/admin_dashboard", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['admin'], children: _jsx(AdminDashboard, {}) }) }), _jsx(Route, { path: "/admin/register-patient", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['admin'], children: _jsx(PatientRegistration, {}) }) }), _jsx(Route, { path: "/admin/register-doctor", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['admin'], children: _jsx(DoctorRegistration, {}) }) }), _jsx(Route, { path: "/admin/register-pharmacist", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['admin'], children: _jsx(PharmacistRegistration, {}) }) }), _jsx(Route, { path: "/admin/register-admin", element: _jsx(ProtectedRoute, { user: user, allowedRoles: ['admin'], children: _jsx(AdminRegistration, {}) }) }), _jsx(Route, { path: "*", element: user
                            ? _jsx(Navigate, { to: user.role === 'doctor'
                                    ? '/doc_dashboard'
                                    : user.role === 'admin'
                                        ? '/admin_dashboard'
                                        : '/pharm_dashboard' })
                            : _jsx(Navigate, { to: "/login" }) })] })] }));
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
        }
        else {
            localStorage.removeItem('user');
        }
    }, [user]);
    return (_jsx(Router, { children: _jsx(AppContent, { user: user, setUser: setUser }) }));
}
export default App;
