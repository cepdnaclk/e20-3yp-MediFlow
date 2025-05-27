import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMedkit,
  FaPrescriptionBottleAlt,
  FaChevronCircleRight,
  FaChevronCircleLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const PharmacistPrescription: React.FC = () => {
  // State for prescriptions queue
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentPrescriptionIndex, setCurrentPrescriptionIndex] = useState(0);
  const [autoDispenseMedicines, setAutoDispenseMedicines] = useState([]);
  const [manualDispenseMedicines, setManualDispenseMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this hook


  // Get current prescription
  const currentPrescription = prescriptions[currentPrescriptionIndex] || {};
  

  // Fetch all prescriptions and set up the queue
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // Check if token exists
        if (!token) {
          console.error('No authentication token found');
          window.location.href = '/login';
          return;
        }

        // Set up request headers with authentication token
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch prescriptions with authentication
        const prescriptionsResponse = await fetch(`${API_URL}/api/prescriptions`, {
          headers
        });

        if (prescriptionsResponse.status === 401 || prescriptionsResponse.status === 403) {
          console.error('Authentication failed or access denied');
          window.location.href = '/login';
          return;
        }

        const prescriptionsData = await prescriptionsResponse.json();
        console.log('Prescriptions data:', prescriptionsData);

        // Extract the array from the response object
        const prescriptionsArray = prescriptionsData.prescriptions || [];
        console.log('Prescriptions array:', prescriptionsArray);

        // Fetch auto-dispense medicines from DynamoDB DispenserStatus
        let autoDispenseMedicineIds = [];
        try {
          const dispenserResponse = await fetch(`${API_URL}/api/dispensers/available-medicines`, {
            headers
          });

          if (dispenserResponse.ok) {
            const dispenserData = await dispenserResponse.json();
            console.log('Auto-dispense medicines from DynamoDB:', dispenserData);
            autoDispenseMedicineIds = dispenserData.autoDispenseMedicineIds || [];
          } else {
            console.log('Could not fetch auto-dispense medicines from DynamoDB, using fallback');
            // Fallback: treat all medicines as manual dispense
            autoDispenseMedicineIds = [];
          }
        } catch (dispenserError) {
          console.log('Error fetching auto-dispense medicines:', dispenserError);
          // Fallback: treat all medicines as manual dispense
          autoDispenseMedicineIds = [];
        }

        // Set prescriptions with progress tracking
        const enhancedPrescriptions = prescriptionsArray.map(prescription => ({
          ...prescription,
          progress: 0,
          completed: false
        }));

        setPrescriptions(enhancedPrescriptions);

        // If prescriptions exist, set up the first prescription
        if (enhancedPrescriptions.length > 0) {
          console.log('Loading first prescription:', enhancedPrescriptions[0]);
          loadPrescriptionData(enhancedPrescriptions[0], autoDispenseMedicineIds);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Load medicine data for a specific prescription
  const loadPrescriptionData = (prescription, autoDispenseMedicineIds) => {
    console.log('Loading prescription data:', prescription);
    console.log('Prescription medicines:', prescription.medicines);
    console.log('Auto-dispense medicine IDs from dispensers:', autoDispenseMedicineIds);
    
    if (!prescription || !prescription.medicines || !Array.isArray(prescription.medicines)) {
      console.log('No medicines found in prescription or medicines is not an array');
      setAutoDispenseMedicines([]);
      setManualDispenseMedicines([]);
      return;
    }

    const autoDispense = [];
    const manualDispense = [];

    // Categorize medicines based on dispenser availability
    prescription.medicines.forEach(medicine => {
      console.log('Processing medicine:', medicine);
      
      // Handle different medicine ID fields (some have 'id', some have 'medicineId')
      const medicineId = medicine.medicineId || medicine.id;
      
      const enhancedMedication = {
        ...medicine,
        id: medicineId, // Ensure we have a consistent ID field
        completed: false
      };

      // Check if this medicine is available in auto-dispensers
      const isAutoDispenseMedicine = autoDispenseMedicineIds.includes(medicineId);

      if (isAutoDispenseMedicine) {
        autoDispense.push(enhancedMedication);
        console.log('Added to auto dispense (available in dispenser):', enhancedMedication);
      } else {
        manualDispense.push(enhancedMedication);
        console.log('Added to manual dispense (not in dispenser):', enhancedMedication);
      }
    });

    console.log('Final auto dispense medicines:', autoDispense);
    console.log('Final manual dispense medicines:', manualDispense);

    setAutoDispenseMedicines(autoDispense);
    setManualDispenseMedicines(manualDispense);
  };

  // Navigate to next prescription in queue
  const handleNextPrescription = () => {
    // Update current prescription progress as completed
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[currentPrescriptionIndex].completed = true;
    updatedPrescriptions[currentPrescriptionIndex].progress = 100;
    setPrescriptions(updatedPrescriptions);

    // Move to next prescription if available
    if (currentPrescriptionIndex < prescriptions.length - 1) {
      const nextIndex = currentPrescriptionIndex + 1;
      setCurrentPrescriptionIndex(nextIndex);

      // Get auto-dispense medicines from DynamoDB
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/api/dispensers/available-medicines`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Could not fetch auto-dispense medicines');
        })
        .then(data => {
          const autoDispenseMedicineIds = data.autoDispenseMedicineIds || [];
          loadPrescriptionData(prescriptions[nextIndex], autoDispenseMedicineIds);
        })
        .catch(error => {
          console.log('Error fetching auto-dispense medicines:', error);
          loadPrescriptionData(prescriptions[nextIndex], []);
        });
    }
  };

  // Navigate to previous prescription in queue
  const handlePreviousPrescription = () => {
    if (currentPrescriptionIndex > 0) {
      const prevIndex = currentPrescriptionIndex - 1;
      setCurrentPrescriptionIndex(prevIndex);

      // Get auto-dispense medicines from DynamoDB
      const token = localStorage.getItem('token');
      fetch(`${API_URL}/api/dispensers/available-medicines`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Could not fetch auto-dispense medicines');
        })
        .then(data => {
          const autoDispenseMedicineIds = data.autoDispenseMedicineIds || [];
          loadPrescriptionData(prescriptions[prevIndex], autoDispenseMedicineIds);
        })
        .catch(error => {
          console.log('Error fetching auto-dispense medicines:', error);
          loadPrescriptionData(prescriptions[prevIndex], []);
        });
    }
  };

  // Mark auto-dispense medicines as completed and trigger automatic dispenser
  const handleProceedAutoDispense = async () => {
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Extract medicines that need to be dispensed with their quantities
      const medicinesToDispense = autoDispenseMedicines.map(med => ({
        id: med.id,
        name: med.name,
        quantity: med.quantity || 1 // Default to 1 if not specified
      }));

      // Send request to backend to trigger individual dispensers via AWS IoT MQTT
      const response = await fetch(`${API_URL}/api/dispensers/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prescriptionId: currentPrescription.id,
          medicines: medicinesToDispense
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to trigger dispensers');
      }
      
      const responseData = await response.json();
      console.log(responseData.message);
      
      // After successful API call, update UI state
      setAutoDispenseMedicines((prev) =>
        prev.map((med) => ({ ...med, completed: true }))
      );

      // Update prescription progress
      updatePrescriptionProgress();

    } catch (error) {
      console.error('Error triggering dispensers:', error);
      alert('Failed to communicate with dispensers. Please try again.');
    }
  };

  // Mark manual dispense medicine as done
  const handleMarkAsDone = (id) => {
    setManualDispenseMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, completed: true } : med))
    );

    // Update prescription progress
    updatePrescriptionProgress();
  };

  // Calculate and update prescription progress
  const updatePrescriptionProgress = () => {
    const totalMeds = autoDispenseMedicines.length + manualDispenseMedicines.length;
    const completedMeds = [
      ...autoDispenseMedicines.filter(med => med.completed),
      ...manualDispenseMedicines.filter(med => med.completed)
    ].length;

    const progress = totalMeds > 0 ? Math.round((completedMeds / totalMeds) * 100) : 0;

    // Update progress in prescriptions array
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[currentPrescriptionIndex].progress = progress;
    setPrescriptions(updatedPrescriptions);
  };

  // Check if all medicines in current prescription are completed
  const allMedicationsCompleted = () => {
    const autoCompleted = autoDispenseMedicines.every(med => med.completed);
    const manualCompleted = manualDispenseMedicines.every(med => med.completed);
    return autoCompleted && manualCompleted;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-600 font-semibold">Loading prescriptions...</div>
      </div>
    );
  }

  // No prescriptions available
  if (prescriptions.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-b mb-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/pharm_dashboard')} // Add this onClick handler
                  className="text-lg text-blue-600 font-semibold hover:text-blue-800"
                >
                  <FaArrowLeft className="inline mr-2" /> Back
                </button>
                <h1 className="text-3xl font-bold text-purple-800 ml-2">
                  Pharmacist Dashboard
                </h1>
              </div>

            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
            <div className="text-xl text-center text-gray-600">
              No prescriptions available in the queue
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation - Modern Redesign */}
        <div className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="flex justify-between h-20 items-center px-6">
            <div className="flex items-center space-x-5">
              <motion.button 
                onClick={() => navigate('/pharm_dashboard')}
                className="group flex items-center space-x-2 text-indigo-600 font-medium bg-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Back</span>
              </motion.button>
              
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-800 to-indigo-600 bg-clip-text text-transparent">
                  Pharmacist Dashboard
                </h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <div className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                Pharmacy ID: PH-5721
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <span className="text-sm font-bold">RX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Queue Information */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-semibold text-gray-700">
                Current Prescription
              </div>
              <div className="flex items-center mt-2">
                <div
                  id="prescription-id" 
                  className="text-1xl font-bold text-blue-600 mr-3">
                  ID: {currentPrescription.id || 'N/A'}
                </div>
                {currentPrescription.patientName && (
                  <div className="text-lg text-gray-600">
                    Patient: {currentPrescription.patientName}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-lg font-medium">
                Prescription {currentPrescriptionIndex + 1} of {prescriptions.length}
              </div>
              <div className="w-64 h-3 bg-gray-200 rounded-full mt-2">
                <div
                  className="h-3 bg-blue-600 rounded-full"
                  style={{ width: `${currentPrescription.progress || 0}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Progress: {currentPrescription.progress || 0}% Complete
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Medicines Dispensed by Automatic Dispenser */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all">
          <div className="flex items-center mb-6">
            <FaMedkit className="text-3xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">
              Medicines Dispensed by Automatic Dispenser
            </h3>
          </div>
          {autoDispenseMedicines.length === 0 ? (
            <div className="text-lg text-gray-600 py-4">
              No automatic dispense medicines for this prescription
            </div>
          ) : (
            <div className="space-y-6">
              {autoDispenseMedicines.map((med) => (
                <div
                  key={med.id}
                  className={`flex items-center justify-between p-6 rounded-xl shadow-md transition-all ${med.completed ? 'bg-green-50' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {med.name}
                    </h4>
                    <p className="text-base text-gray-600">Dosage: {med.dosage}</p>
                    <p className="text-base text-gray-600">Quantity: {med.quantity}</p>
                  </div>
                  {med.completed && <FaCheckCircle className="text-green-600 text-2xl" />}
                </div>
              ))}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleProceedAutoDispense}
                  disabled={autoDispenseMedicines.every(med => med.completed)}
                  className={`py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${autoDispenseMedicines.every(med => med.completed)
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  <FaChevronCircleRight className="mr-2" /> Proceed
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Medicines to be Taken Manually */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all">
          <div className="flex items-center mb-6">
            <FaPrescriptionBottleAlt className="text-3xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">
              Medicines to be Taken Manually
            </h3>
          </div>
          {manualDispenseMedicines.length === 0 ? (
            <div className="text-lg text-gray-600 py-4">
              No manual dispense medicines for this prescription
            </div>
          ) : (
            <div className="space-y-6">
              {manualDispenseMedicines.map((med) => (
                <div
                  key={med.id}
                  className={`flex items-center justify-between p-6 rounded-xl shadow-md transition-all ${med.completed ? 'bg-green-50' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {med.name}
                    </h4>
                    <p className="text-base text-gray-600">Dosage: {med.dosage}</p>
                    <p className="text-base text-gray-600">Quantity: {med.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    {med.completed ? (
                      <FaCheckCircle className="text-green-600 text-2xl" />
                    ) : (
                      <button
                        onClick={() => handleMarkAsDone(med.id)}
                        className="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all font-semibold text-lg flex items-center"
                      >
                        <FaCheckCircle className="mr-2" /> Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between mt-6 mb-8">
          <button
            onClick={handlePreviousPrescription}
            disabled={currentPrescriptionIndex === 0}
            className={`py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${currentPrescriptionIndex === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            <FaChevronCircleLeft className="mr-2" /> Previous Prescription
          </button>

          <button
            onClick={handleNextPrescription}
            disabled={currentPrescriptionIndex === prescriptions.length - 1 && allMedicationsCompleted()}
            className={`py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${currentPrescriptionIndex === prescriptions.length - 1 && allMedicationsCompleted()
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            <FaChevronCircleRight className="mr-2" />
            {currentPrescriptionIndex === prescriptions.length - 1
              ? 'Complete All Prescriptions'
              : 'Next Prescription'}
          </button>
        </div>

        {/* Queue Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Prescription Queue Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescription ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prescriptions.map((prescription, index) => (
                  <tr
                    key={prescription.id}
                    className={index === currentPrescriptionIndex ? "bg-blue-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {prescription.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {prescription.patientName || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prescription.completed
                        ? 'bg-green-100 text-green-800'
                        : index === currentPrescriptionIndex
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {prescription.completed
                          ? 'Completed'
                          : index === currentPrescriptionIndex
                            ? 'In Progress'
                            : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${prescription.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {prescription.progress || 0}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistPrescription;