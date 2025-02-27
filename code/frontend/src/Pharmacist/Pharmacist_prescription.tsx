import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMedkit,
  FaPrescriptionBottleAlt,
  FaChevronCircleRight,
  FaChevronCircleLeft,
} from "react-icons/fa";

const PharmacistPrescription: React.FC = () => {
  // State for prescriptions queue
  const [prescriptions, setPrescriptions] = useState([]);
  const [currentPrescriptionIndex, setCurrentPrescriptionIndex] = useState(0);
  const [autoDispenseMedicines, setAutoDispenseMedicines] = useState([]);
  const [manualDispenseMedicines, setManualDispenseMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const prescriptionsResponse = await fetch('http://localhost:5000/api/prescriptions', {
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
        
        // Fetch auto-dispense data with authentication
        const autoDispenseResponse = await fetch('http://localhost:5000/api/auto-dispense', {
          headers
        });
  
        if (autoDispenseResponse.status === 401 || autoDispenseResponse.status === 403) {
          console.error('Authentication failed or access denied');
          window.location.href = '/login';
          return;
        }
  
        const autoDispenseData = await autoDispenseResponse.json();
        console.log('Auto-dispense data:', autoDispenseData);
        
        // Extract the array from the auto-dispense response object
        const autoDispenseArray = autoDispenseData.autoDispense || [];
  
        // Set prescriptions with progress tracking
        const enhancedPrescriptions = prescriptionsArray.map(prescription => ({
          ...prescription,
          progress: 0,
          completed: false
        }));
        
        setPrescriptions(enhancedPrescriptions);
        
        // If prescriptions exist, set up the first prescription
        if (enhancedPrescriptions.length > 0) {
          loadPrescriptionData(enhancedPrescriptions[0], autoDispenseArray);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        setLoading(false);
      }
    };
  
    fetchPrescriptions();
  }, []);

  // Load medication data for a specific prescription
  const loadPrescriptionData = (prescription, autoDispenseArray) => {
    if (!prescription || !prescription.medications) {
      setAutoDispenseMedicines([]);
      setManualDispenseMedicines([]);
      return;
    }

    const autoDispense = [];
    const manualDispense = [];

    // Categorize medications based on auto-dispense status
    prescription.medications.forEach(medication => {
      const enhancedMedication = {
        ...medication,
        completed: false
      };
      
      if (autoDispenseArray.some(entry => entry.medicationIds.includes(medication.id))) {
        autoDispense.push(enhancedMedication);
      } else {
        manualDispense.push(enhancedMedication);
      }
    });

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
      
      // Get auto-dispense data (in a real app, you'd fetch this again if needed)
      const token = localStorage.getItem('token');
      fetch('http://localhost:5000/api/auto-dispense', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        const autoDispenseArray = data.autoDispense || [];
        loadPrescriptionData(prescriptions[nextIndex], autoDispenseArray);
      })
      .catch(error => {
        console.error('Error fetching auto-dispense data:', error);
      });
    }
  };

  // Navigate to previous prescription in queue
  const handlePreviousPrescription = () => {
    if (currentPrescriptionIndex > 0) {
      const prevIndex = currentPrescriptionIndex - 1;
      setCurrentPrescriptionIndex(prevIndex);
      
      // Get auto-dispense data
      const token = localStorage.getItem('token');
      fetch('http://localhost:5000/api/auto-dispense', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        const autoDispenseArray = data.autoDispense || [];
        loadPrescriptionData(prescriptions[prevIndex], autoDispenseArray);
      })
      .catch(error => {
        console.error('Error fetching auto-dispense data:', error);
      });
    }
  };

  // Mark auto-dispense medicines as completed
  const handleProceedAutoDispense = () => {
    setAutoDispenseMedicines((prev) =>
      prev.map((med) => ({ ...med, completed: true }))
    );
    
    // Update prescription progress
    updatePrescriptionProgress();
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

  // Check if all medications in current prescription are completed
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
                <button className="text-lg text-blue-600 font-semibold hover:text-blue-800">
                  <FaArrowLeft className="inline mr-2" /> Back
                </button>
                <h1 className="text-3xl font-bold text-gray-800">
                  Pharmacist Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base text-gray-600">
                  Pharmacist ID: P789012
                </span>
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
        {/* Top Navigation */}
        <div className="bg-white border-b mb-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <button className="text-lg text-blue-600 font-semibold hover:text-blue-800">
                <FaArrowLeft className="inline mr-2" /> Back
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                Pharmacist Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base text-gray-600">
                Pharmacist ID: P789012
              </span>
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
                <div className="text-3xl font-bold text-blue-600 mr-3">
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
              No automatic dispense medications for this prescription
            </div>
          ) : (
            <div className="space-y-6">
              {autoDispenseMedicines.map((med) => (
                <div
                  key={med.id}
                  className={`flex items-center justify-between p-6 rounded-xl shadow-md transition-all ${
                    med.completed ? 'bg-green-50' : 'bg-gray-100 hover:bg-gray-200'
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
                  className={`py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${
                    autoDispenseMedicines.every(med => med.completed)
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
              No manual dispense medications for this prescription
            </div>
          ) : (
            <div className="space-y-6">
              {manualDispenseMedicines.map((med) => (
                <div
                  key={med.id}
                  className={`flex items-center justify-between p-6 rounded-xl shadow-md transition-all ${
                    med.completed ? 'bg-green-50' : 'bg-gray-100 hover:bg-gray-200'
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
            className={`py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${
              currentPrescriptionIndex === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaChevronCircleLeft className="mr-2" /> Previous Prescription
          </button>
          
          <button
            onClick={handleNextPrescription}
            disabled={currentPrescriptionIndex === prescriptions.length - 1 && allMedicationsCompleted()}
            className={`py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${
              currentPrescriptionIndex === prescriptions.length - 1 && allMedicationsCompleted()
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prescription.completed
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