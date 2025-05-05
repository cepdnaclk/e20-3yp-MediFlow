import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Stethoscope, AlertCircle, Upload, NfcIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterDoctor = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    email: '',
    phone: '',
    specialization: '',
    qualifications: '',
    licenseNumber: '',
    experience: '',
    hospitalAffiliation: '',
    username: '',
    password: '',
    confirmPassword: '',
    availability: {
      monday: { available: false, startTime: '09:00', endTime: '17:00' },
      tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
      wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
      thursday: { available: false, startTime: '09:00', endTime: '17:00' },
      friday: { available: false, startTime: '09:00', endTime: '17:00' },
      saturday: { available: false, startTime: '09:00', endTime: '13:00' },
      sunday: { available: false, startTime: '09:00', endTime: '13:00' }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      availability: {
        ...prevState.availability,
        [day]: {
          ...prevState.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // In a real application, you would send this data to your API
      // const formDataToSend = new FormData();
      // Object.keys(formData).forEach(key => {
      //   if (key === 'availability') {
      //     formDataToSend.append(key, JSON.stringify(formData[key]));
      //   } else {
      //     formDataToSend.append(key, formData[key]);
      //   }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage(`Dr. ${formData.firstName} ${formData.lastName} registered successfully!`);
      
      // Reset the form
      setFormData({
        firstName: '',
        lastName: '',
        nic: '',
        email: '',
        phone: '',
        specialization: '',
        qualifications: '',
        licenseNumber: '',
        experience: '',
        hospitalAffiliation: '',
        username: '',
        password: '',
        confirmPassword: '',
        availability: {
          monday: { available: false, startTime: '09:00', endTime: '17:00' },
          tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
          wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
          thursday: { available: false, startTime: '09:00', endTime: '17:00' },
          friday: { available: false, startTime: '09:00', endTime: '17:00' },
          saturday: { available: false, startTime: '09:00', endTime: '13:00' },
          sunday: { available: false, startTime: '09:00', endTime: '13:00' }
        }
      });
      setProfileImage(null);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred while registering the doctor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <motion.button
            onClick={() => navigate('/admin_dashboard')}
            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Dashboard
          </motion.button>
        </div>
        
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 py-8 bg-gradient-to-r from-teal-500 to-teal-600 sm:px-10">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-full">
                <Stethoscope className="h-8 w-8 text-teal-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">Register New Doctor</h1>
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
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Profile Picture Upload */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden relative bg-gray-100">
                      {profileImage ? (
                        <img src={profileImage} alt="Doctor profile" className="w-full h-full object-cover" />
                      ) : (
                        <Stethoscope className="h-12 w-12 text-gray-400" />
                      )}
                      <input
                        type="file"
                        id="profilePicture"
                        onChange={handleImageChange}
                        className="opacity-0 absolute inset-0 cursor-pointer"
                        accept="image/*"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                        <Upload className="h-3 w-3 inline-block mr-1" />
                        Upload
                      </div>
                    </div>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">
                        NIC Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="nic"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        required
                        pattern="^([0-9]{9}[vVxX]|[0-9]{12})$"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address 
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
              

              {/* Professional Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Medical Specialization <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    >
                      <option value="">Select Specialization</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Surgery">Surgery</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                      Qualifications/Degrees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="qualifications"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      required
                      placeholder="MD, PhD, etc."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Medical License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital/Clinic Affiliation
                    </label>
                    <input
                      type="text"
                      id="hospitalAffiliation"
                      name="hospitalAffiliation"
                      value={formData.hospitalAffiliation}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>
              </div>
              
              {/* Weekly Availability */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Weekly Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(formData.availability).map(day => (
                    <div key={day} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium text-gray-700 capitalize">{day}</label>
                        <input
                          type="checkbox"
                          checked={formData.availability[day].available}
                          onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                          className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                      </div>
                      
                      <div className={`grid grid-cols-2 gap-2 ${formData.availability[day].available ? 'opacity-100' : 'opacity-50'}`}>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={formData.availability[day].startTime}
                            onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                            disabled={!formData.availability[day].available}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">End Time</label>
                          <input
                            type="time"
                            value={formData.availability[day].endTime}
                            onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                            disabled={!formData.availability[day].available}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Account Credentials Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Account Credentials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div></div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Save className="h-5 w-5 mr-2" />
                  )}
                  {isLoading ? 'Registering...' : 'Register Doctor'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterDoctor;