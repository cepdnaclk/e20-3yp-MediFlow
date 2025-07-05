import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/password/verify-token/${token}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Invalid or expired token');
        }
        
        // Store user ID to local storage for the reset component
        localStorage.setItem('resetUserId', data.userId);
        localStorage.setItem('resetToken', token);
        
        // Redirect to the reset password page
        navigate('/reset-password');
      } catch (err) {
        setError(err.message || 'Failed to verify token');
        setIsLoading(false);
      }
    };
    
    if (token) {
      verifyToken();
    } else {
      setError('No token provided');
      setIsLoading(false);
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white">Verifying your reset link...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordVerify;