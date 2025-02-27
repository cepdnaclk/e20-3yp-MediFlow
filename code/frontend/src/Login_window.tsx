import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login_window = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send credentials to the backend auth endpoint
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Extract token
      const { token } = data;

      // Store token in localStorage for future API requests
      localStorage.setItem("token", token);

      // Decode token to get user data (without validation - just for UI purposes)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(window.atob(base64));

      // Create user object with data from token
      const user = {
        id: decodedToken.id,
        role: decodedToken.role,
        email: formData.email
      };

      // Set user in app state
      setUser(user);
      setError("");

      // Redirect based on role
      if (user.role === "doctor") {
        navigate("/doc_dashboard");
      } else if (user.role === "pharmacist") {
        navigate("/pharm_dashboard");
      }

    } catch (err) {
      console.error("Error during login:", err);
      setError("Server error. Try again later.");
    }
  };

  // Animated background component for the entire page
  const AnimatedPageBackground = () => {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Animated gradient meshes */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 to-blue-900">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-800 opacity-20 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-600 opacity-20 blur-3xl animate-float-reverse"></div>
          <div className="absolute top-2/3 left-2/3 w-64 h-64 rounded-full bg-teal-500 opacity-10 blur-3xl animate-pulse" style={{ animationDuration: "8s" }}></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Moving particles */}
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="absolute w-2 h-2 bg-white rounded-full animate-float-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.1 + Math.random() * 0.3,
                  animationDuration: `${15 + Math.random() * 30}s`,
                  animationDelay: `${Math.random() * 10}s`
                }}
              ></div>
            ))}
          </div>

          {/* Animated lines crossing screen */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            <line x1="0%" y1="20%" x2="100%" y2="80%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-dash-slow" />
            <line x1="0%" y1="80%" x2="100%" y2="20%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-dash-slow" style={{ animationDelay: "2s" }} />
            <line x1="20%" y1="0%" x2="80%" y2="100%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-dash-slow" style={{ animationDelay: "4s" }} />
            <line x1="80%" y1="0%" x2="20%" y2="100%" stroke="url(#lineGradient)" strokeWidth="1" className="animate-dash-slow" style={{ animationDelay: "6s" }} />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Animated background for the entire page */}
      <AnimatedPageBackground />

      <div className="w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl shadow-2xl flex overflow-hidden border border-white border-opacity-20 relative z-10">
        {/* Left Section (Brand) with animations */}
        <div className="flex-1 bg-gradient-to-br from-purple-900 to-blue-600 p-10 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute w-40 h-40 bg-white rounded-full -top-20 -left-20 opacity-30 animate-pulse"></div>
            <div className="absolute w-60 h-60 bg-white rounded-full -bottom-20 -right-20 opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>

            {/* Additional floating elements with animations */}
            <div className="absolute w-16 h-16 bg-white rounded-full top-1/4 left-1/4 opacity-20 animate-bounce" style={{ animationDuration: "3s" }}></div>
            <div className="absolute w-12 h-12 bg-white rounded-full bottom-1/3 right-1/3 opacity-20 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}></div>
            <div className="absolute w-8 h-8 bg-white rounded-full top-1/2 right-1/4 opacity-20 animate-ping" style={{ animationDuration: "5s" }}></div>
          </div>

          {/* Brand content with animations */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 bg-opacity-90 backdrop-blur-sm animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-white text-5xl font-bold mb-3 animate-fadeIn">Medi-Flow</h1>
            <p className="text-white text-opacity-90 text-lg transform hover:scale-105 transition-all duration-300">Clinical Management System</p>

            <div className="mt-10 space-y-4 text-white text-opacity-80">
              <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: "0.1s" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>Multi-role Access</span>
              </div>
              <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: "0.2s" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Login Form) with gray borders */}
        <div className="flex-1 p-10 bg-white bg-opacity-100 backdrop-blur-md">
          <div className="mb-10">
            <h2 className="text-3xl text-gray-800 font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-opacity-80">Sign in to access your dashboard</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-opacity-90 font-medium mb-2">Email/Username</label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-opacity-50 group-focus-within:text-teal-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <input
                  type="email"
                  className="w-full py-4 pl-10 pr-4 rounded-xl bg-white bg-opacity-10 border border-gray-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 text-gray-700 placeholder-gray-400 transition-all"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-opacity-90 font-medium mb-2">Password</label>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-opacity-50 group-focus-within:text-teal-400 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <input
                  type="password"
                  className="w-full py-4 pl-10 pr-4 rounded-xl bg-white bg-opacity-10 border border-gray-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 text-gray-700 placeholder-gray-400 transition-all"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-gray-600 text-opacity-80 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded bg-white bg-opacity-10 border-gray-400 text-teal-500 focus:ring-teal-400 focus:ring-opacity-50"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:text-black transition-colors">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 to-blue-500 text-white font-bold shadow-lg hover:from-teal-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 transition-all transform hover:scale-105"
            >
              Sign In
            </button>

            {/* Error Message */}
            {error && <p className="text-red-500 font-medium">{error}</p>}
          </form>

          <div className="mt-8 text-center text-gray-500 text-opacity-70">
            <p>Need help? <a href="#" className="text-teal-500 hover:text-teal-400">Contact support</a></p>
          </div>
        </div>
      </div>

      {/* Add CSS for custom animations */}
      <style>{`
        /* Define grid pattern */
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(251, 251, 251, 0.13) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 0.5; transform: translateY(0); }
        }
        
        @keyframes float-slow {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 20px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-reverse {
          0% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes float-particle {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(100px, -100px); opacity: 0; }
        }
        
        @keyframes dash-slow {
          0% { stroke-dasharray: 0, 1500; stroke-dashoffset: 0; opacity: 0; }
          2% { opacity: 1; }
          100% { stroke-dasharray: 1500, 1500; stroke-dashoffset: -1500; opacity: 0; }
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-float-reverse {
          animation: float-reverse 18s ease-in-out infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 30s linear infinite;
        }
        
        .animate-dash-slow {
          animation: dash-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login_window;