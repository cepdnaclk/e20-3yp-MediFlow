import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaLightbulb } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';


interface AIAssistantProps {
  patientId: string;
  apiUrl?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ patientId, apiUrl = 'http://localhost:5000' }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(true);

    // Inside AIAssistant component
  const requestMade = useRef(false);

  useEffect(() => {
    if (patientId && !requestMade.current) {
      // Make the API request
      requestMade.current = true;
    }
  }, [patientId]);

  useEffect(() => {
    const fetchAiAssistance = async () => {
      if (!patientId) return;
      
      setIsAiLoading(true);
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setAiResponse('You must be logged in to access AI assistance.');
          setIsAiLoading(false);
          return;
        }

        // Make API request
        const response = await fetch(`${apiUrl}/api/ai-assistance/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch AI assistance');
        }

        // Parse response data
        const data = await response.json();
        setAiResponse(data.aiResponse);
      } catch (error) {
        console.error('Error fetching AI assistance:', error);
        setAiResponse('Unable to retrieve AI assistance at this time.');
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAiAssistance();
  }, [patientId, apiUrl]);

  if (!showAiAssistant) return null;

  return (
    <AnimatePresence>
      {showAiAssistant && (
        <motion.div 
          className="relative overflow-hidden bg-white shadow-lg rounded-xl mb-8 border-2 border-blue-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: '0 4px 20px rgba(0, 62, 255, 0.1)',
          }}
        >
          {/* Subtle accent border */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          
          <div className="flex justify-between items-center p-5 border-b border-blue-200">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-md mr-4 shadow-md">
                <FaRobot className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Clinical Assistant</h3>
            </div>
            <button 
              onClick={() => setShowAiAssistant(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="p-4">
            {isAiLoading ? (
              <div className="flex flex-col items-center py-6">
                <div className="flex space-x-3 mb-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ['#3b82f6', '#6366f1', '#3b82f6']
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-4 h-4 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ['#3b82f6', '#6366f1', '#3b82f6']
                    }}
                    transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                    className="w-4 h-4 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      backgroundColor: ['#3b82f6', '#6366f1', '#3b82f6']
                    }}
                    transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                    className="w-4 h-4 bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-gray-500 text-lg">Analyzing patient data...</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <FaLightbulb className="text-yellow-500 text-lg" />
                  </div>
                  <p className="text-green-800 font-medium text-lg">Clinical Insights</p>
                </div>
                
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-5 border-l-3 border-blue-400 shadow-sm">
                  <p className="text-black-600 leading-relaxed text-lg">
                    <ReactMarkdown>{aiResponse ? aiResponse : 'No insights available at this time.'}</ReactMarkdown>
                    
                  </p>
                </div>
                
                {/* <div className="mt-2 text-right">
                  <button className="text-md bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-4 rounded-full transition-colors">
                    Ask for details →
                  </button>
                </div> */}
              </motion.div>
            )}
          </div>

          {/* Decorative corner accent */}
          <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-blue-500 to-indigo-500 rounded-tl-full"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;