import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  Package,
  ClipboardList,
  Activity
} from 'lucide-react';
import { Avatar } from '@radix-ui/react-avatar';
import { Button } from './components/ui/button.js';
import { Input } from './components/ui/input.js';
import { useNavigate } from 'react-router-dom';
import AnimatedCrossLogo from './components/ui/AnimatedCrossLogo.js';


const MediFlowNavbar = ({ userRole = 'pharmacist' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isLogoAnimated, setIsLogoAnimated] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define role-specific menu items
  const menuItemsByRole = {
    doctor: [
      { id: 'doc_dashboard', label: 'Dashboard', icon: BarChart2 },
      { id: 'scan_patients', label: 'Scan Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'records', label: 'Medical Records', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
    pharmacist: [
      { id: 'pharm_dashboard', label: 'Dashboard', icon: BarChart2 },
      // { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
      // { id: 'medications', label: 'Medications', icon: Package },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]
  };

  // Get menu items based on current role
  const menuItems = menuItemsByRole[userRole] || menuItemsByRole.doctor;

  // Set active item on role change (resets to dashboard)
  useEffect(() => {
    setActiveItem('dashboard');
  }, [userRole]);

  // User info based on role
  const userInfo = {
    doctor: {
      name: 'Dr. Sam Sulek',
      title: 'Physician'
    },
    pharmacist: {
      name: 'Lisa Chen',
      title: 'Clinical Pharmacist'
    }
  }[userRole];

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <AnimatedCrossLogo isLogoAnimated={isLogoAnimated} setIsLogoAnimated={setIsLogoAnimated} />
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex ml-10 space-x-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      data-testid={`menu-item-${item.id}`}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center relative ${
                        activeItem === item.id 
                          ? 'text-indigo-600' 
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`}
                      onClick={() => {
                        setActiveItem(item.id);
                        if (item.id === 'prescriptions') {
                          navigate('/pharmacist_prescription');
                        }
                        if (item.id === 'pharm_dashboard') {
                          navigate('/pharm_dashboard');
                        }
                        if (item.id === 'scan_patients') {
                          navigate('/scan');
                        }
                        if (item.id === 'doc_dashboard') {
                          navigate('/doc_dashboard');
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {item.label}
                      {activeItem === item.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                          layoutId="activeTab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            {/* Role Indicator */}
            <div className="hidden md:flex">
              <div 
                id="role-indicator"
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                userRole === 'doctor' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {userRole === 'doctor' ? 'Doctor' : 'Pharmacist'}
              </div>
            </div>
            
            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 pr-4 py-2 w-40 lg:w-56 h-9 text-sm rounded-full border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200"
                />
              </div>
              
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {notifications > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {notifications}
                  </span>
                )}
              </motion.div>
              
              {/* User Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-indigo-100">
                  <img src="/pharmacist.jpeg" alt="User" />
                </div>
                <div className="ml-2 hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
                  <p className="text-xs text-gray-500">{userInfo.title}</p>
                </div>
              </motion.div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl z-50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="px-4 py-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Mobile Menu Logo */}
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" stroke="#4F46E5" strokeWidth="2" fill="white" />
                        <line x1="9" y1="16" x2="23" y2="16" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
                        <line x1="16" y1="9" x2="16" y2="23" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <span className="ml-2 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        MediFlow
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-4 mb-2">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-indigo-100">
                        <img src="/pharmacist.jpeg" alt="User" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{userInfo.name}</p>
                      <p className="text-xs text-gray-500">{userInfo.title}</p>
                    </div>
                  </div>
                  <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    userRole === 'doctor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {userRole === 'doctor' ? 'Doctor' : 'Pharmacist'}
                  </div>
                </div>
                
                <div className="py-2 flex-grow overflow-y-auto">
                  <div className="px-2 space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          className={`w-full px-3 py-2.5 rounded-lg text-sm font-medium flex items-center ${
                            activeItem === item.id 
                              ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-sm' 
                              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                          onClick={() => {
                            setActiveItem(item.id);
                            setIsMobileMenuOpen(false);
                            if (item.id === 'prescriptions') {
                              navigate('/pharmacist_prescription');
                            }
                            if (item.id === 'pharm_dashboard') {
                              navigate('/pharm_dashboard');
                            }
                            if (item.id === 'scan_patients') {
                              navigate('/scan');
                            }
                            if (item.id === 'doc_dashboard') {
                              navigate('/doc_dashboard');
                            }
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content Spacer */}
      <div className="h-16"></div>
    </>
  );
};

export default MediFlowNavbar;