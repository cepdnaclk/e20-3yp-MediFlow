import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      // Decode token to get user role
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(window.atob(base64));
      const role = decodedToken.role;
      
      setUserRole(role);
      
      // Check if user has required role
      if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem('token');
      setIsAuthorized(false);
    }
  }, [allowedRoles]);

  if (isAuthorized === null) {
    // Still checking authorization
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    // User is not authorized

    // If not authenticated, redirect to login
    if (!userRole) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but wrong role, redirect to appropriate dashboard
    if (userRole === "doctor") {
      return <Navigate to="/doc_dashboard" replace />;
    } else if (userRole === "pharmacist") {
      return <Navigate to="/pharmacist_prescription" replace />;
    } else if (userRole === "admin") {
      return <Navigate to="/admin_dashboard" replace />;
    }
    
    return <Navigate to="/login" replace />;
  }

  // User is authorized
  return <>{children}</>;
};

export default ProtectedRoute;