import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  PlusCircle 
} from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { motion } from "framer-motion";
import { Card, CardContent } from '../components/ui/card.js';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const DoctorDashboardHeader = ({user}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  
  // Add state for user profile
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profilePhoto: null,
    specialization: ''
  });
  
  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Set greeting based on time of day
    const hour = currentTime.getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
    
    return () => clearInterval(timer);
  }, [currentTime]);
  
  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUserProfile({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            profilePhoto: userData.profilePhoto || null,
            specialization: userData.specialization || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Format date
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format time
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Compute full name from profile or use fallback
  const fullName = userProfile.firstName && userProfile.lastName 
    ? `Dr. ${userProfile.firstName} ${userProfile.lastName}` 
    : 'Dr. Sam Sulek';
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8 mt-6">
      <Card className="border-0 overflow-hidden shadow-xl bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 backdrop-blur-sm">
        <CardContent className="p-0">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-8"
          >
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Left: Profile Picture */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="relative flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden ring-4 ring-white/70 ring-offset-4 ring-offset-transparent shadow-2xl">
                    {userProfile.profilePhoto ? (
                      <img 
                        src={userProfile.profilePhoto} 
                        alt={fullName} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/doctor_avatar.png';
                        }} 
                      />
                    ) : (
                      <img 
                        src="/doctor_avatar.png" 
                        alt={fullName} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Profile Info Below Picture */}
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{fullName}</h3>
                  <p className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full inline-block">
                    {userProfile.specialization || 'Physician'}
                  </p>
                </div>
              </motion.div>
              
              {/* Center: Welcome Message & Date/Time */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                      {greeting}
                    </span>
                  </h1>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center lg:justify-start">
                      <CalendarIcon className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="text-lg font-medium text-gray-700">{formattedDate}</span>
                    </div>
                    
                    <div className="flex items-center justify-center lg:justify-start">
                      <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Welcome back! Ready to provide exceptional care today?
                  </p>
                </motion.div>
              </div>
              
              {/* Right: Join a Clinic button */}
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-center"
                    >
                      <Button 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 rounded-xl shadow-lg shadow-indigo-500/25 text-white font-semibold text-lg transition-all duration-300"
                        onClick={() => navigate('/scan')}
                      >
                        <PlusCircle className="w-6 h-6 mr-3" />
                        Join a Clinic
                      </Button>
                      <p className="text-sm text-gray-500 mt-3 max-w-xs">
                        Connect with new clinics and expand your network
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Decorative gradient blur */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl -z-10 rounded-2xl"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardHeader;