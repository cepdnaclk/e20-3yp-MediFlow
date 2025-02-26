import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronDown,
  PlusCircle 
} from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { motion } from "framer-motion";
import { Card, CardContent } from '../components/ui/card.js';
import { useNavigate } from 'react-router-dom';

const DoctorDashboardHeader = ({user}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  
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
  
  // Upcoming appointments for today
  const upcomingAppointments = [
    { time: "10:30 AM", patient: "John Doe", type: "Check-up" },
    { time: "1:15 PM", patient: "Emily Chen", type: "Follow-up" },
    { time: "3:00 PM", patient: "Robert Williams", type: "Consultation" }
  ];
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 mt-6">
      <Card className="border border-gray-200 overflow-hidden shadow-md rounded-xl">
        <CardContent className="p-0">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gradient-to-br from-white to-indigo-50/30"
          >
            <div className="flex flex-col lg:flex-row justify-between">
              {/* Left: Calendar & Time */}
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  <h2 className="text-lg font-medium text-gray-800">{formattedDate}</h2>
                </div>
                
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formattedTime}
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg">{greeting}, Dr. Sam Sulek</p>
                
                <div className="mt-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-500 mr-1">Primary Location:</span>
                  <span className="text-sm font-medium text-gray-700 mr-1">Northwest Medical Center</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              
              {/* Center: Today's appointments summary */}
              <div className="mb-6 lg:mb-0 lg:ml-8 lg:mr-8 flex-1">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Today's Schedule</h3>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment, idx) => (
                    <div key={idx} className="flex items-center p-2 rounded-md hover:bg-white transition-colors">
                      <div className="w-16 text-sm font-medium text-indigo-600">{appointment.time}</div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-800">{appointment.patient}</div>
                        <div className="text-xs text-gray-500">{appointment.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button variant="ghost" className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0">
                    View full schedule →
                  </Button>
                </div>
              </div>
              
              {/* Right: Join a Clinic button */}
              <div className="flex flex-col items-center justify-center lg:pl-4 mr-30">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center"
                  >
                    <Button 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-6 rounded-lg shadow-md"
                      onClick={() => navigate('/scan')}
                    >
                      <PlusCircle className="w-6 h-6 mr-2" />
                      Join a Clinic
                    </Button>
                    <span className="text-xs text-gray-500 mt-2">Connect with new clinics in your network</span>
                  </motion.div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 w-full text-center">
                    <div className="text-sm font-medium text-gray-800">Clinics: 3</div>
                    <div className="text-xs text-gray-500">Active collaborations</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardHeader;