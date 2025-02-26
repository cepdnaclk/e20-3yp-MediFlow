import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMedkit,
  FaPrescriptionBottleAlt,
  FaChevronCircleRight,
} from "react-icons/fa";

const PharmacistPrescription: React.FC = () => {
  const [autoDispenseMedicines, setAutoDispenseMedicines] = useState([]);
  const [manualDispenseMedicines, setManualDispenseMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const prescriptionsResponse = await fetch('http://localhost:5000/prescriptions');
        const prescriptionsData = await prescriptionsResponse.json();

        const autoDispenseResponse = await fetch('http://localhost:5000/auto_dispense');
        const autoDispenseData = await autoDispenseResponse.json();

        const autoDispense = [];
        const manualDispense = [];

        prescriptionsData.forEach(prescription => {
          prescription.medications.forEach(medication => {
            if (autoDispenseData.some(entry => entry.medicationIds.includes(medication.id))) {
              autoDispense.push(medication);
            } else {
              manualDispense.push(medication);
            }
          });
        });

        setAutoDispenseMedicines(autoDispense);
        setManualDispenseMedicines(manualDispense);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, []);

  const handleProceed = () => {
    setAutoDispenseMedicines((prev) =>
      prev.map((med) => ({ ...med, completed: true }))
    );
  };

  const handleMarkAsDone = (id: number) => {
    setManualDispenseMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, completed: true } : med))
    );
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

        {/* Section 1: Medicines Dispensed by Automatic Dispenser */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all">
          <div className="flex items-center mb-6">
            <FaMedkit className="text-3xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">
              Medicines Dispensed by Automatic Dispenser
            </h3>
          </div>
          <div className="space-y-6">
            {autoDispenseMedicines.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-6 bg-gray-100 rounded-xl shadow-md transition-all hover:bg-gray-200"
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
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleProceed}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg flex items-center"
            >
              <FaChevronCircleRight className="mr-2" /> Proceed
            </button>
          </div>
        </div>

        {/* Section 2: Medicines to be Taken Manually */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all">
          <div className="flex items-center mb-6">
            <FaPrescriptionBottleAlt className="text-3xl text-blue-600 mr-4" />
            <h3 className="text-2xl font-semibold text-gray-800">
              Medicines to be Taken Manually
            </h3>
          </div>
          <div className="space-y-6">
            {manualDispenseMedicines.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-6 bg-gray-100 rounded-xl shadow-md transition-all hover:bg-gray-200"
              >
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {med.name}
                  </h4>
                  <p className="text-base text-gray-600">Dosage: {med.dosage}</p>
                  <p className="text-base text-gray-600">Quantity: {med.quantity}</p>
                </div>
                <div className="flex items-center">
                  {med.completed && <FaCheckCircle className="text-green-600 text-2xl mr-3" />}
                  <button
                    onClick={() => handleMarkAsDone(med.id)}
                    className="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all font-semibold text-lg flex items-center"
                  >
                    <FaCheckCircle className="mr-2" /> Mark as Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-6 ">
            <button
              onClick={handleProceed}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all font-semibold text-lg flex items-center"
            >
              <FaChevronCircleRight className="mr-2" /> Next Prescription
            </button>
          </div>
      </div>
    </div>
  );
};

export default PharmacistPrescription;