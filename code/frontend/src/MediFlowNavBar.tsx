import React, { useState, useEffect, useRef } from 'react';
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
  Activity,
  Shield,
  UsersIcon,
  AlertTriangle
} from 'lucide-react';
import { Avatar } from '@radix-ui/react-avatar';
import { Button } from './components/ui/button.js';
import { Input } from './components/ui/input.js';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedCrossLogo from './components/ui/AnimatedCrossLogo.js';

const API_URL = import.meta.env.VITE_API_URL ;

const MediFlowNavbar = ({ userRole = 'pharmacist' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isLogoAnimated, setIsLogoAnimated] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  
  // Add state for user profile
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    profilePhoto: null,
    specialization: ''
  });
  
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  // Define role-specific menu items
  const menuItemsByRole = {
    doctor: [
      { id: 'doc_dashboard', label: 'Dashboard', icon: BarChart2, path: '/doc_dashboard' },
      { id: 'scan_patients', label: 'Scan Patients', icon: Users, path: '/scan' },
      { id: 'records', label: 'Medical Records', icon: FileText, path: '/doctor/patient-records' },
    ],
    pharmacist: [
      { id: 'pharm_dashboard', label: 'Dashboard', icon: BarChart2, path: '/pharm_dashboard' },
      { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList, path: '/pharmacist_prescription' },
      { id: 'dispensers', label: 'Dispensers', icon: Package, path: '/dispensers' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
    ],
    admin: [
      { id: 'admin_dashboard', label: 'Dashboard', icon: BarChart2, path: '/admin_dashboard' },
      { id: 'user_management', label: 'Users', icon: UsersIcon, path: '/admin/user-management' },
      { id: 'roles', label: 'Roles', icon: Shield, path: '/admin/roles' },
    ]
  };

  // Get menu items based on current role
  const menuItems = menuItemsByRole[userRole] ;

  // Update activeItem based on current location
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find the menu item that matches the current path
    const currentMenuItem = menuItems.find(item => currentPath === item.path);
    
    if (currentMenuItem) {
      setActiveItem(currentMenuItem.id);
    } else if (currentPath.includes('/scan')) {
      setActiveItem('scan_patients');
    } else if (currentPath.includes('/profile') || currentPath.includes('/patient-profile')) {
      setActiveItem('records');
    }
  }, [location.pathname, menuItems]);

  // User info based on role (fallback)
  const userInfo = {
    doctor: {
      name: 'Dr. Sam Sulek',
      title: 'Physician'
    },
    pharmacist: {
      name: 'Lisa Chen',
      title: 'Clinical Pharmacist'
    },
    admin: {
      name: 'Admin User',
      title: 'System Administrator'
    }
  }[userRole];
  
  // Compute full name from profile or use fallback
  const fullName = userProfile.firstName && userProfile.lastName 
    ? `${userProfile.firstName} ${userProfile.lastName}` 
    : userInfo.name;
    
  // Determine title based on role and specialization
  const title = userProfile.specialization 
    ? userProfile.specialization 
    : userInfo.title;

  // Role color configuration
  const roleColors = {
    doctor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pharmacist: 'bg-violet-50 text-violet-700 border-violet-200',
    admin: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
            : 'bg-white/90 backdrop-blur-md'
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
              <div className="hidden md:flex ml-10 space-x-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      data-testid={`menu-item-${item.id}`}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center relative transition-all duration-300 ${
                        activeItem === item.id 
                          ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-500/25' 
                          : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80'
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
                        if (item.id === 'admin_dashboard') {
                          navigate('/admin_dashboard');
                        }
                        if (item.id === 'dispensers') {
                          navigate('/dispensers');
                        }
                        if (item.id === 'records') {
                              navigate('/doctor/patient-records');
                            }
                      }}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            {/* Role Indicator */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.div 
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${roleColors[userRole]}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    userRole === 'doctor' ? 'bg-emerald-500' : 
                    userRole === 'admin' ? 'bg-rose-500' : 'bg-violet-500'
                  }`} />
                  <span>{userRole === 'doctor' ? 'Doctor' : userRole === 'admin' ? 'Admin' : 'Pharmacist'}</span>
                </div>
              </motion.div>
              
              {/* User Avatar with Enhanced Menu */}
              <div className="relative" ref={dropdownRef}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center cursor-pointer p-2 rounded-xl hover:bg-gray-50/80 transition-all duration-200"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <div className="h-9 w-9 rounded-full overflow-hidden ring-2 ring-gray-100 ring-offset-2">
                    {userProfile.profilePhoto ? (
                      <img 
                        src={userProfile.profilePhoto} 
                        alt={fullName} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `/${userRole}_avatar.png`;
                        }} 
                      />
                    ) : (
                      <img 
                        src={`/${userRole}_avatar.png`} 
                        alt={fullName} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="ml-3 hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                    <p className="text-xs text-gray-500">{title}</p>
                  </div>
                  <motion.div 
                    className="ml-2 text-gray-400"
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </motion.div>
                </motion.div>
                
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-gray-100">
                            {userProfile.profilePhoto ? (
                              <img 
                                src={userProfile.profilePhoto} 
                                alt={fullName} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = `/${userRole}_avatar.png`;
                                }} 
                              />
                            ) : (
                              <img 
                                src={`/${userRole}_avatar.png`} 
                                alt={fullName} 
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{fullName}</p>
                            <p className="text-sm text-gray-500">{title}</p>
                          </div>
                        </div>
                      </div> */}
                      <div className="p-2">
                        <button
                          className="group w-full flex items-center px-3 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-200"
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowLogoutConfirmation(true);
                          }}
                        >
                          <div className="mr-3 p-2 rounded-full bg-red-50 group-hover:bg-red-100 transition-all duration-200">
                            <LogOut className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="group-hover:text-red-600 transition-colors duration-200 font-medium">Sign out</span>
                          <motion.div 
                            className="ml-auto opacity-0 group-hover:opacity-100"
                            initial={{ x: -5 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500">
                              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </motion.div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="fixed inset-y-0 right-0 w-80 bg-white/95 backdrop-blur-lg shadow-2xl z-50 border-l border-gray-100"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" stroke="#4F46E5" strokeWidth="2" fill="white" />
                        <line x1="9" y1="16" x2="23" y2="16" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
                        <line x1="16" y1="9" x2="16" y2="23" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                      <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        MediFlow
                      </span>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50/80 rounded-2xl">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-gray-200">
                        {userProfile.profilePhoto ? (
                          <img 
                            src={userProfile.profilePhoto} 
                            alt={fullName} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `/${userRole}_avatar.png`;
                            }} 
                          />
                        ) : (
                          <img 
                            src={`/${userRole}_avatar.png`} 
                            alt={fullName} 
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{fullName}</p>
                      <p className="text-xs text-gray-500">{title}</p>
                      <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${roleColors[userRole]}`}>
                        <div className="flex items-center space-x-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            userRole === 'doctor' ? 'bg-emerald-500' : 
                            userRole === 'admin' ? 'bg-rose-500' : 'bg-violet-500'
                          }`} />
                          <span>{userRole === 'doctor' ? 'Doctor' : userRole === 'admin' ? 'Admin' : 'Pharmacist'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="py-2 flex-grow overflow-y-auto">
                  <div className="px-4 space-y-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          className={`w-full px-4 py-3 rounded-xl text-sm font-medium flex items-center transition-all duration-200 ${
                            activeItem === item.id 
                              ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-500/25' 
                              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/80'
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
                            if (item.id === 'dispensers') {
                              navigate('/dispensers');
                            }
                            if (item.id === 'records') {
                              navigate('/doctor/patient-records');
                            }
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl border-gray-200 transition-all duration-200"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutConfirmation(true);
                    }}
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
      
      {/* Enhanced Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirmation && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirmation(false)}
          >
            <motion.div 
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-96 overflow-hidden border border-gray-100"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 h-28"></div>
                <div className="relative pt-16 px-6 flex justify-center">
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center ring-4 ring-red-50"
                    initial={{ y: 20, scale: 0.8 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                  >
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <LogOut className="h-10 w-10 text-red-500" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
              
              <div className="p-6 pt-8">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                  Ready to leave?
                </h3>
                <p className="text-sm text-gray-600 text-center mb-8 leading-relaxed">
                  You'll need to sign in again to access your MediFlow account and continue your work.
                </p>
                <div className="flex flex-col space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium shadow-lg shadow-red-500/25 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <motion.div 
                      className="flex items-center justify-center w-full"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      Sign Out
                      <LogOut className="w-4 h-4 ml-2" />
                    </motion.div>
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-medium transition-all duration-200"
                    onClick={() => setShowLogoutConfirmation(false)}
                  >
                    Stay Signed In
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