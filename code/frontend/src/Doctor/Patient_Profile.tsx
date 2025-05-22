import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPills, FaExclamationCircle, FaPlusCircle, FaTimes, FaPrint, FaHistory, FaNotesMedical, FaRobot, FaLightbulb } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Add this import
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AIAssistant from '../components/ui/AIAssistant';

const API_URL = import.meta.env.VITE_API_URL;

const PatientProfile: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([{ id: 1, name: 'Amoxicillin', dosage: '250mg', frequency: 'Once daily', duration: '7 days' }]);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [patientStatus, setPatientStatus] = useState('');
  const [doctorComments, setDoctorComments] = useState('');
  const [prescriptionHistory, setPrescriptionHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const patientId = patient?.id;

  const handleAddMedication = () => {
    const newMed = {
      id: medications.length + 1,
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
    };
    setMedications([...medications, newMed]);
  };
  

  const handleRemoveMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  const calculateQuantity = (frequency: string, duration: string) => {
    const frequencyMap: { [key: string]: number } = {
      'Once daily': 1,
      'Twice daily': 2,
      'Three times daily': 3,
    };

    const durationMap: { [key: string]: number } = {
      '3 days': 3,
      '5 days': 5,
      '7 days': 7,
      '1 month': 30,
    };

    return frequencyMap[frequency] * durationMap[duration];
  };

  const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  // Get token from localStorage
  const token = localStorage.getItem("token");
  
  // If no token is found, redirect to login
  if (!token) {
    console.error("Authentication token not found");
    navigate('/login');
    return;
  }

  const prescriptionData = {
    patientId: patient.id,
    patientName: `${patient.firstName} ${patient.lastName}`,
    age: patient.age,
    allergies: patient.allergies,
    diagnosis,
    prescriptionDate,
    patientStatus,
    doctorComments,
    medications: medications.map((med) => ({
      ...med,
      quantity: calculateQuantity(med.frequency, med.duration),
    })),
  };

  try {
    // Use the same approach as in fetchPrescriptionHistory
    const apiUrl = API_URL; // Fallback URL if env variable is missing
    const requestUrl = `${apiUrl}/api/prescriptions`;
    
    console.log("Sending prescription to:", requestUrl);

    // Updated to use the backend API endpoint with token authentication
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(prescriptionData),
    });

    if (response.ok) {
      // Success message or redirect
      console.log("Prescription created successfully");
      navigate('/scan');
    } else {
      // Handle specific status codes
      if (response.status === 401) {
        console.error('Authentication expired. Please login again.');
        navigate('/login');
      } else if (response.status === 403) {
        console.error('You do not have permission to create prescriptions');
      } else {
        // Safely handle JSON parsing
        try {
          const errorData = await response.json();
          console.error('Failed to save prescription:', errorData.message);
        } catch (jsonError) {
          console.error('Failed to save prescription - Invalid response format');
        }
      }
    }
  } catch (error) {
    console.error('Error saving prescription:', error);
  }
};

  

  // Add this after your other function declarations
  useEffect(() => {
    // Simulate loading patient data
    const timer = setTimeout(() => {
      setIsLoadingPatient(false);
    }, 800);
    
    if (patient && patient.id) {
      fetchPrescriptionHistory();
    }
    
    return () => clearTimeout(timer);
  }, [patient]);

const fetchPrescriptionHistory = async () => {
  setIsLoadingHistory(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found");
      navigate('/login');
      return;
    }

    // Log the complete URL to debug
    const apiUrl = API_URL ; // Fallback URL if env variable is missing
    const requestUrl = `${apiUrl}/api/prescriptions/patient/${patient.id}`;
    // console.log("Making request to:", requestUrl);
    
    const response = await fetch(requestUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    
    // For debugging - try to see what's actually being returned
    const responseText = await response.text();
    
    // Only try to parse as JSON if it really is JSON
    if (response.ok && responseText.trim().startsWith('{')) {
      const data = JSON.parse(responseText);
      setPrescriptionHistory(data.prescriptions || []);
    } else {
      console.error('Failed to fetch prescription history - Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching prescription history:', error);
  } finally {
    setIsLoadingHistory(false);
  }
};

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b mb-8 shadow-sm rounded-xl"
        >
          <div className="flex justify-between h-16 items-center px-4">
            <div className="flex items-center space-x-4">
              <button className="text-lg text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                <FaArrowLeft className="inline mr-2" /> Back
              </button>
              <h1 className="text-3xl font-bold text-gray-800">Patient Profile</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base text-gray-600">Patient ID: {patient.id}</span>
              <button className="text-base bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all font-semibold">
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>


        {/* AI Assistant Component */}
        {patientId && <AIAssistant patientId={patientId} apiUrl={API_URL} />}

        {/* New Prescription Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all"
        >
          <div className="flex items-center mb-6">
            <FaPills className="text-3xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">New Prescription</h3>
          </div>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Patient Information</h3>
                <AnimatePresence>
                  {isLoadingPatient ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Skeleton height={24} className="mb-2" />
                      <Skeleton height={24} className="mb-2" />
                      <Skeleton height={24} />
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2 text-base text-gray-600"
                    >
                      <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
                      <p><strong>Age:</strong> {patient.age} years</p>
                      <div className="flex items-center">
                        <FaExclamationCircle className="text-red-500 mr-2" />
                        <p><strong>Allergies:</strong> {Array.isArray(patient.allergies) ? patient.allergies.join(', ') : (patient.allergies || 'None')}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


                {/* Enhanced Prescription History Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mt-8 bg-white shadow-md rounded-xl overflow-hidden border border-gray-100"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b border-blue-200">
                    <div className="flex items-center">
                      <FaHistory className="text-2xl text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">Medical History</h3>
                    </div>
                  </div>
                  
                  <div className="h-100 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100">
                    <AnimatePresence>
                      {isLoadingHistory ? (
                        <div className="py-8 flex justify-center items-center h-full">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
                          />
                        </div>
                      ) : prescriptionHistory.length > 0 ? (
                        <div className="py-4 space-y-4">
                          {prescriptionHistory.map((prescription, index) => (
                            <motion.div 
                              key={prescription.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer bg-white"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {new Date(prescription.prescriptionDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  <p className="text-gray-600 mt-1">
                                    <span className="font-medium">Diagnosis:</span> {prescription.diagnosis}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  prescription.status === 'dispensed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {prescription.status === 'dispensed' ? 'Dispensed' : 'Pending'}
                                </span>
                              </div>
                              
                              <div className="mt-3 pl-3 border-l-2 border-blue-200">
                                <p className="text-sm font-medium text-gray-700">Status: {prescription.patientStatus || 'Not specified'}</p>
                                
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Medications:</p>
                                  <ul className="list-disc pl-5 text-sm text-gray-600">
                                    {prescription.medications && prescription.medications.map((med, idx) => (
                                      <li key={idx} className="mt-1">
                                        <span className="font-medium">{med.name}</span> {med.dosage} - {med.frequency} for {med.duration}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              {prescription.doctorComments && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-3 pt-3 border-t border-gray-100"
                                >
                                  <p className="text-sm font-medium text-gray-700 flex items-center">
                                    <FaNotesMedical className="text-blue-500 mr-2" />
                                    Doctor Notes:
                                  </p>
                                  <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded mt-1">
                                    "{prescription.doctorComments}"
                                  </p>
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center h-full py-12 px-4 text-center"
                        >
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="text-gray-500 font-medium">No prescription history found for this patient.</p>
                          <p className="text-gray-400 text-sm mt-1">This appears to be their first visit.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Prescription Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Prescription Details</h3>
                <div className="space-y-4">
                  <input
                    type="date"
                    className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600"
                    value={prescriptionDate}
                    onChange={(e) => setPrescriptionDate(e.target.value)}
                  />
                  <select
                    className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  >
                    <option value="">Select Diagnosis</option>
                    <option value="Hypertension">Hypertension</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Other">Other</option>
                  </select>
                  
                  {/* Patient Status - Changed to Textarea */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaExclamationCircle className="text-blue-600 mr-2" />
                      <label className="text-lg font-medium text-gray-700">Patient's Current Status</label>
                    </div>
                    <textarea
                      placeholder="Enter patient's current status and condition details..."
                      className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600 min-h-[150px] resize-y"
                      value={patientStatus}
                      onChange={(e) => setPatientStatus(e.target.value)}
                    />
                  </div>
                  
                  {/* Doctor Comments Field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FaNotesMedical className="text-blue-600 mr-2" />
                      <label className="text-lg font-medium text-gray-700">Doctor Comments</label>
                    </div>
                    <textarea
                      placeholder="Enter your observations or instructions..."
                      className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600 min-h-[180px] resize-y"
                      value={doctorComments}
                      onChange={(e) => setDoctorComments(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Medications Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Medications</h3>

                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="text-lg bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all font-semibold "
                >
                  <div className="flex items-center space-x-2">
                    <FaPlusCircle className="mr-2" /> Add Medication
                  </div>
                </button>
              </div>

              {/* Medication Fields */}
              {medications.map((med, index) => (
                <div key={med.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 p-6 bg-gray-100 rounded-xl relative transition-all hover:bg-gray-200">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(med.id)}
                    className="absolute top-0 right-0 p-2 bg-white rounded-full text-gray-500 hover:text-red-600"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                  <select
                    className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600"
                    value={med.name}
                    onChange={(e) => {
                      const newMedications = [...medications];
                      newMedications[index].name = e.target.value;
                      setMedications(newMedications);
                    }}
                  >
                    <option value="Amoxicillin">Amoxicillin</option>
                    <option value="Metformin">Metformin</option>
                    <option value="Lisinopril">Lisinopril</option>
                  </select>
                  <select
                    className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600"
                    value={med.dosage}
                    onChange={(e) => {
                      const newMedications = [...medications];
                      newMedications[index].dosage = e.target.value;
                      setMedications(newMedications);
                    }}
                  >
                    <option value="250mg">250mg</option>
                    <option value="500mg">500mg</option>
                    <option value="1000mg">1000mg</option>
                  </select>
                  <select
                    className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600"
                    value={med.frequency}
                    onChange={(e) => {
                      const newMedications = [...medications];
                      newMedications[index].frequency = e.target.value;
                      setMedications(newMedications);
                    }}
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                  </select>
                  <select
                    className="w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600"
                    value={med.duration}
                    onChange={(e) => {
                      const newMedications = [...medications];
                      newMedications[index].duration = e.target.value;
                      setMedications(newMedications);
                    }}
                  >
                    <option value="3 days">3 days</option>
                    <option value="5 days">5 days</option>
                    <option value="7 days">7 days</option>
                    <option value="1 month">1 month</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center space-x-6 pt-6 border-t-2">
              <button
                id='submit'
                type="submit"
                className="w-full md:w-auto bg-blue-600 text-white py-4 px-8 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg"
              >
                Submit
              </button>
              <button
                type="button"
                className="w-full md:w-auto border border-gray-300 text-gray-700 py-4 px-8 rounded-xl hover:border-gray-400 transition-all font-semibold text-lg"
              >
                <FaPrint className="mr-2" /> Print Prescription
              </button>
            </div>
          </form>
          </motion.div>

      </div>
    </div>
  );
};

export default PatientProfile;