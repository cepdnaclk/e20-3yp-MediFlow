import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowLeft, CheckCircle, Upload, X, Pill, BadgeCheck, User, Phone, Mail, Lock, Briefcase, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { useNavigate } from 'react-router-dom';

const PharmacistRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    workExperience: '',
    pharmacyName: '',
    username: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Get the API URL from environment variable or use a default
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Prepare the data to send to your API
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        // Explicitly set role to pharmacist
        role: "pharmacist",
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        phone: formData.phone,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        workExperience: formData.workExperience,
        pharmacyName: formData.pharmacyName
      };
      
      console.log("Sending pharmacist registration data:", dataToSend);
      
      // Get token from localStorage for authentication
      const token = localStorage.getItem('token');
      
      // Make the actual API call
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(dataToSend)
      });
      
      // Parse the response
      const data = await response.json();
      
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register pharmacist');
      }
      
      setSuccessMessage(`${formData.firstName} ${formData.lastName} registered successfully! A temporary password has been sent to their email.`);
      setIsSuccess(true);
      
      // Reset the form
      setFormData({
        firstName: '',
        lastName: '',
        nic: '',
        email: '',
        phone: '',
        specialization: '',
        licenseNumber: '',
        workExperience: '',
        pharmacyName: '',
        username: ''
      });
      setPhotoPreview(null);

      // Show success message for 2 seconds then navigate back
      setTimeout(() => {
        navigate('/register-pharmacist');
      }, 2000);
      
    } catch (error) {
      console.error('Error registering pharmacist:', error);
      setErrorMessage(error.message || 'An error occurred while registering the pharmacist');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.button
          onClick={() => navigate('/admin_dashboard')}
          className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
        </motion.button>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-8 bg-gradient-to-r from-purple-500 to-indigo-600 sm:px-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-full">
                  <Database className="h-8 w-8 text-purple-500" />
                </div>
                <h1 className="text-2xl font-bold text-white">Register New Pharmacist</h1>
              </div>
              <span className="bg-purple-700/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                Healthcare Professional
              </span>
            </div>
          </div>
          
          <div className="px-6 py-8 sm:px-10">
            {successMessage && (
              <motion.div 
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="flex-shrink-0 mr-2">✓</span>
                {successMessage}
              </motion.div>
            )}
            
            {errorMessage && (
              <motion.div 
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                {errorMessage}
              </motion.div>
            )}

            {isSuccess ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-75 blur-sm"></div>
                    <div className="relative bg-white p-4 rounded-full">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                <p className="text-gray-600 mb-4">Pharmacist has been registered successfully.</p>
                <div className="flex justify-center">
                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                    Redirecting to dashboard...
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Photo Upload Section */}
                <div className="flex flex-col md:flex-row gap-8 p-6 bg-purple-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {photoPreview ? (
                        <div className="relative w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                          <img 
                            src={photoPreview} 
                            alt="Pharmacist preview" 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            type="button"
                            onClick={removePhoto}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-40 h-40 bg-white rounded-xl border-4 border-white shadow-lg">
                          <User className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">No photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacist Photo
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload a professional photo for identification purposes.
                    </p>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center px-4 py-2.5 bg-white border border-purple-300 rounded-lg text-purple-600 shadow-sm hover:bg-purple-50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </motion.button>
                  </div>
                </div>

                {/* Personal Information Section */}
                <div>
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4">
                    <User className="h-5 w-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">NIC Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="nic"
                          value={formData.nic}
                          onChange={handleChange}
                          required
                          pattern="^([0-9]{9}[vVxX]|[0-9]{12})$"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <BadgeCheck className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Username <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Information Section */}
                <div>
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4">
                    <Mail className="h-5 w-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Information Section */}
                <div>
                  <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4">
                    <Briefcase className="h-5 w-5 text-purple-500" />
                    <h2 className="text-lg font-semibold text-gray-800">Professional Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <div className="relative">
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        >
                          <option value="">Select Specialization</option>
                          <option value="Clinical Pharmacy">Clinical Pharmacy</option>
                          <option value="Community Pharmacy">Community Pharmacy</option>
                          <option value="Hospital Pharmacy">Hospital Pharmacy</option>
                          <option value="Pharmacy Informatics">Pharmacy Informatics</option>
                          <option value="Geriatric Pharmacy">Geriatric Pharmacy</option>
                          <option value="Oncology Pharmacy">Oncology Pharmacy</option>
                          <option value="Nuclear Pharmacy">Nuclear Pharmacy</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Pill className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">License Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          required
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <BadgeCheck className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Work Experience (Years)</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="workExperience"
                          value={formData.workExperience}
                          onChange={handleChange}
                          min="0"
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Briefcase className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Pharmacy Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="pharmacyName"
                          value={formData.pharmacyName}
                          onChange={handleChange}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Database className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> A temporary password will be automatically generated and sent to the pharmacist's email. 
                    They will be required to change this password when they first log in.
                  </p>
                </div>
                
                <div className="pt-6">
                  <motion.button
                    type="submit"
                    className="w-full flex justify-center items-center p-3 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Pharmacist
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacistRegistration;