import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [strings, setStrings] = useState([]);
  const [particles, setParticles] = useState([]);

  // Generate random curved strings across the screen (same as login page)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/password/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      // Check if email doesn't exist (user not found)
      if (response.status === 404 || data.status === 'error' || data.error === 'user_not_found') {
        setError(data.message || 'No account found with this email address. Please check and try again.');
        setIsLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Set success state but don't redirect
      setIsSuccess(true);
      
      // No automatic redirect to login page
      
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual navigation to login
  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate('/login');
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
      
      {/* Forgot Password Box */}
      <div className="z-10 w-100 bg-opacity-5 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-purple-200 border-opacity-10">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/login')} 
            className="text-purple-300 hover:text-white transition-colors mr-auto"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-3xl text-white font-bold mb-1">Reset Password</h2>
            <p className="text-purple-200">Enter your email to receive a reset link</p>
          </div>
        </div>
        
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-75 blur-sm"></div>
                <div className="relative bg-black bg-opacity-50 p-4 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
            <p className="text-blue-200 mb-4">
              Password reset link has been sent to your email.
            </p>
            <button
              onClick={handleBackToLogin}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900 bg-opacity-20 border border-red-400 border-opacity-20 rounded-lg text-red-200 text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Password Reset Link'}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-blue-200">
                Remember your password? <a href="#" onClick={handleBackToLogin} className="font-medium text-purple-400 hover:text-purple-300">Sign in</a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;