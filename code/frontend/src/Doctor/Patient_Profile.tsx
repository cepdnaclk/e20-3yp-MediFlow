import React, { useState } from 'react';
import { FaArrowLeft, FaPills, FaExclamationCircle, FaPlusCircle, FaTimes, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const PatientProfile: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([{ id: 1, name: 'Amoxicillin', dosage: '250mg', frequency: 'Once daily', duration: '7 days' }]);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient;

  if (!patient) {
    return <div>No patient data found. Please scan again.</div>;
  }

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
      medications: medications.map((med) => ({
        ...med,
        quantity: calculateQuantity(med.frequency, med.duration),
      })),
    };
  
    try {
      // Updated to use the backend API endpoint with token authentication
      const response = await fetch('http://localhost:5000/api/prescriptions', {
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
          const errorData = await response.json();
          console.error('Failed to save prescription:', errorData.message);
        }
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-800">Patient Profile</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base text-gray-600">Patient ID: {patient.id}</span>
              <button className="text-base bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all font-semibold">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* New Prescription Form Card */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all ">
          <div className="flex items-center mb-6">
            <FaPills className="text-3xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">New Prescription</h3>
          </div>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Patient Information</h3>
                <div className="space-y-2 text-base text-gray-600">
                  <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
                  <p><strong>Age:</strong> {patient.age} years</p>
                  <div className="flex items-center">
                    <FaExclamationCircle className="text-red-500 mr-2" />
                    <p><strong>Allergies:</strong> {Array.isArray(patient.allergies) ? patient.allergies.join(', ') : (patient.allergies || 'None')}</p>
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;