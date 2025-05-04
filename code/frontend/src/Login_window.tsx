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
  const [strings, setStrings] = useState([]);
  const [particles, setParticles] = useState([]);

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
      } else if (user.role === "admin") {
        navigate("/admin_dashboard");
      } 

    } catch (err) {
      console.error("Error during login:", err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen bg-black overflow-hidden">
      {/* Background animated strings */}
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
      
      {/* Login box */}
      <div className="z-10 w-120  bg-opacity-5 backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-purple-200 border-opacity-10">
        <div className="flex items-center mb-6 justify-center">
          <div className="mr-4 bg-purple-900 bg-opacity-10 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-15 w-15 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-4xl text-white font-bold mb-1">Medi-Flow</h2>
            <p className="text-purple-200">Sign in to access your dashboard</p>
          </div>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="email">
              Email/Username
            </label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-white text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-blue-200 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-purple-400 hover:text-blue-300">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>

          {/* Error Message */}
          {error && <p className="text-red-400 font-medium text-center">{error}</p>}
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

export default Login_window;