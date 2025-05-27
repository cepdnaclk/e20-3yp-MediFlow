import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const PasswordReset = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [strings, setStrings] = useState([]);
  const [particles, setParticles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Generate random curved strings across the screen
  useEffect(() => {
    const generatedStrings = [];
    const generatedParticles = [];
    
    // Generate 8 strings
    for (let i = 0; i < 13; i++) {
      const startY = Math.random() * window.innerHeight;
      const endY = Math.random() * window.innerHeight;
      const controlY1 = Math.random() * window.innerHeight;
      const controlY2 = Math.random() * window.innerHeight;
      
      // Create path for string
      const path = `M 0,${startY} C ${window.innerWidth/3},${controlY1} ${2*window.innerWidth/3},${controlY2} ${window.innerWidth},${endY}`;
      
      generatedStrings.push({
        id: i,
        path,
        opacity: 0.3 + Math.random() * 0.7 // Random opacity
      });
      
      // Create particles for each string
      for (let j = 0; j < 3; j++) {
        generatedParticles.push({
          id: `${i}-${j}`,
          stringId: i,
          progress: Math.random(), // Initial position along the path (0-1)
          speed: 0.002 + Math.random() * 0.0001, // Random speed
          size: 4 + Math.random() * 5 // Random size
        });
      }
    }
    
    setStrings(generatedStrings);
    setParticles(generatedParticles);
  }, []);
  
  // Animation loop for particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animationFrame = requestAnimationFrame(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          progress: (particle.progress + particle.speed) % 1
        }))
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);
  
  // Calculate point position along a path
  const getPointOnPath = (pathElement, progress) => {
    if (!pathElement) return { x: 0, y: 0 };
    
    const length = pathElement.getTotalLength();
    const point = pathElement.getPointAtLength(length * progress);
    return { x: point.x, y: point.y };
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters with at least one uppercase, one lowercase, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Validate passwords
  if (newPassword !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  if (!validatePassword(newPassword)) {
    setError('Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number');
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    if (!token || !userId) {
      setError('You must be logged in to reset your password');
      setLoading(false);
      return;
    }

    const response = await fetch(`${API_URL}/api/password/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, newPassword })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to reset password');
    }

    setSuccess(true);
    
    // Update success message to indicate logout
    setSuccessMessage('Password reset successfully! You will be logged out in a moment.');
    
    // Timeout before logout
    setTimeout(() => {
      // Clear user data and token from localStorage (logout)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      navigate('/login');
    }, 2000);
  } catch (err) {
    setError(err.message || 'An error occurred while resetting your password');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen bg-black overflow-hidden">
      {/* Background animated strings - Same as login page */}
      <svg className="absolute inset-0 w-full h-full">
        {strings.map((string) => (
          <path
            key={string.id}
            d={string.path}
            fill="none"
            stroke="rgba(128, 0, 255, 0.4)"
            strokeWidth="2"
            strokeOpacity={string.opacity}
            ref={(el) => {
              if (el) {
                // Store the path element reference for calculations
                string.element = el;
              }
            }}
          />
        ))}
        
        {/* Animated particles along strings */}
        {particles.map((particle) => {
          const stringRef = strings.find(s => s.id === particle.stringId)?.element;
          if (!stringRef) return null;
          
          const point = getPointOnPath(stringRef, particle.progress);
          
          return (
            <circle
              key={particle.id}
              cx={point.x}
              cy={point.y}
              r={particle.size}
              fill="white"
              fillOpacity="0.7"
              filter="blur(2px)"
            />
          );
        })}
      </svg>
      
      {/* Reset Password Box - Styled like login box */}
      <div className="z-10 w-100 bg-opacity-5 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-purple-200 border-opacity-10">
        <div className="flex items-center mb-6 justify-center">
          <div className="mr-4 bg-purple-900 bg-opacity-10 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-15 w-15 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-4xl text-white font-bold mb-1">Reset Password</h2>
            <p className="text-purple-200">Create a new secure password</p>
          </div>
        </div>
        
        {/* Error Message */}
        {error && <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-400 border-opacity-20 rounded-lg text-red-200 text-sm">
          {error}
        </div>}
        
        {/* Success Message */}
        {success && (
        <div className="mb-4 p-3 bg-green-900 bg-opacity-20 border border-green-400 border-opacity-20 rounded-lg text-green-200 text-sm">
            {successMessage || 'Password reset successfully! Logging out...'}
        </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* New Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="new-password">
              New Password
            </label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                id="new-password"
                name="newPassword"
                className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="text-xs text-blue-200 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
            <p className="mb-1 font-medium">Password requirements:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>At least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one lowercase letter</li>
              <li>Include at least one number</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200">
            Need help? <a href="#" className="font-medium text-green-400 hover:text-green-300">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;