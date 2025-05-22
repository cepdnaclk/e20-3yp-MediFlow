import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle, FaMedkit, FaPrescriptionBottleAlt, FaChevronCircleRight, FaChevronCircleLeft, } from "react-icons/fa";
const API_URL = import.meta.env.REACT_APP_API_URL;
const PharmacistPrescription = () => {
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
                const prescriptionsResponse = await fetch('${API_URL}/api/prescriptions', {
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
                const autoDispenseResponse = await fetch('${API_URL}/api/auto-dispense', {
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
            }
            catch (error) {
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
            }
            else {
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
            fetch('${API_URL}/api/auto-dispense', {
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
            fetch('${API_URL}/api/auto-dispense', {
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
    // Mark auto-dispense medicines as completed and trigger automatic dispenser
    const handleProceedAutoDispense = async () => {
        try {
            // Get authentication token
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }
            // Extract medications that need to be dispensed with their quantities
            const medicationsToDispense = autoDispenseMedicines.map(med => ({
                id: med.id,
                name: med.name,
                quantity: med.quantity || 1 // Default to 1 if not specified
            }));
            // Send request to backend to trigger individual dispensers via AWS IoT MQTT
            const response = await fetch('${API_URL}/api/auto-dispense/trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prescriptionId: currentPrescription.id,
                    medications: medicationsToDispense
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to trigger dispensers');
            }
            const responseData = await response.json();
            console.log(responseData.message);
            //After successful API call, update UI state
            setAutoDispenseMedicines((prev) => prev.map((med) => ({ ...med, completed: true })));
            //Update prescription progress
            updatePrescriptionProgress();
        }
        catch (error) {
            console.error('Error triggering dispensers:', error);
            alert('Failed to communicate with dispensers. Please try again.');
        }
    };
    // Mark manual dispense medicine as done
    const handleMarkAsDone = (id) => {
        setManualDispenseMedicines((prev) => prev.map((med) => (med.id === id ? { ...med, completed: true } : med)));
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
        return (_jsx("div", { className: "bg-gray-50 min-h-screen flex items-center justify-center", children: _jsx("div", { className: "text-2xl text-blue-600 font-semibold", children: "Loading prescriptions..." }) }));
    }
    // No prescriptions available
    if (prescriptions.length === 0) {
        return (_jsx("div", { className: "bg-gray-50 min-h-screen py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "bg-white border-b mb-8", children: _jsxs("div", { className: "flex justify-between h-16 items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { className: "text-lg text-blue-600 font-semibold hover:text-blue-800", children: [_jsx(FaArrowLeft, { className: "inline mr-2" }), " Back"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Pharmacist Dashboard" })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: "text-base text-gray-600", children: "Pharmacist ID: P789012" }) })] }) }), _jsx("div", { className: "bg-white shadow-lg rounded-xl p-8 mb-8", children: _jsx("div", { className: "text-xl text-center text-gray-600", children: "No prescriptions available in the queue" }) })] }) }));
    }
    return (_jsx("div", { className: "bg-gray-50 min-h-screen py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "bg-white border-b mb-8", children: _jsxs("div", { className: "flex justify-between h-16 items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { className: "text-lg text-blue-600 font-semibold hover:text-blue-800", children: [_jsx(FaArrowLeft, { className: "inline mr-2" }), " Back"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Pharmacist Dashboard" })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("span", { className: "text-base text-gray-600", children: "Pharmacist ID: P789012" }) })] }) }), _jsx("div", { className: "bg-white shadow-lg rounded-xl p-6 mb-8", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xl font-semibold text-gray-700", children: "Current Prescription" }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsxs("div", { id: "prescription-id", className: "text-3xl font-bold text-blue-600 mr-3", children: ["ID: ", currentPrescription.id || 'N/A'] }), currentPrescription.patientName && (_jsxs("div", { className: "text-lg text-gray-600", children: ["Patient: ", currentPrescription.patientName] }))] })] }), _jsxs("div", { className: "flex flex-col items-end", children: [_jsxs("div", { className: "text-lg font-medium", children: ["Prescription ", currentPrescriptionIndex + 1, " of ", prescriptions.length] }), _jsx("div", { className: "w-64 h-3 bg-gray-200 rounded-full mt-2", children: _jsx("div", { className: "h-3 bg-blue-600 rounded-full", style: { width: `${currentPrescription.progress || 0}%` } }) }), _jsxs("div", { className: "text-sm text-gray-600 mt-1", children: ["Progress: ", currentPrescription.progress || 0, "% Complete"] })] })] }) }), _jsxs("div", { className: "bg-white shadow-lg rounded-xl p-8 mb-8 transition-all", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(FaMedkit, { className: "text-3xl text-blue-600 mr-4" }), _jsx("h3", { className: "text-2xl font-semibold text-gray-800", children: "Medicines Dispensed by Automatic Dispenser" })] }), autoDispenseMedicines.length === 0 ? (_jsx("div", { className: "text-lg text-gray-600 py-4", children: "No automatic dispense medications for this prescription" })) : (_jsxs("div", { className: "space-y-6", children: [autoDispenseMedicines.map((med) => (_jsxs("div", { className: `flex items-center justify-between p-6 rounded-xl shadow-md transition-all ${med.completed ? 'bg-green-50' : 'bg-gray-100 hover:bg-gray-200'}`, children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800", children: med.name }), _jsxs("p", { className: "text-base text-gray-600", children: ["Dosage: ", med.dosage] }), _jsxs("p", { className: "text-base text-gray-600", children: ["Quantity: ", med.quantity] })] }), med.completed && _jsx(FaCheckCircle, { className: "text-green-600 text-2xl" })] }, med.id))), _jsx("div", { className: "flex justify-end mt-6", children: _jsxs("button", { onClick: handleProceedAutoDispense, disabled: autoDispenseMedicines.every(med => med.completed), className: `py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${autoDispenseMedicines.every(med => med.completed)
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'}`, children: [_jsx(FaChevronCircleRight, { className: "mr-2" }), " Proceed"] }) })] }))] }), _jsxs("div", { className: "bg-white shadow-lg rounded-xl p-8 mb-8 transition-all", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(FaPrescriptionBottleAlt, { className: "text-3xl text-blue-600 mr-4" }), _jsx("h3", { className: "text-2xl font-semibold text-gray-800", children: "Medicines to be Taken Manually" })] }), manualDispenseMedicines.length === 0 ? (_jsx("div", { className: "text-lg text-gray-600 py-4", children: "No manual dispense medications for this prescription" })) : (_jsx("div", { className: "space-y-6", children: manualDispenseMedicines.map((med) => (_jsxs("div", { className: `flex items-center justify-between p-6 rounded-xl shadow-md transition-all ${med.completed ? 'bg-green-50' : 'bg-gray-100 hover:bg-gray-200'}`, children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xl font-semibold text-gray-800", children: med.name }), _jsxs("p", { className: "text-base text-gray-600", children: ["Dosage: ", med.dosage] }), _jsxs("p", { className: "text-base text-gray-600", children: ["Quantity: ", med.quantity] })] }), _jsx("div", { className: "flex items-center", children: med.completed ? (_jsx(FaCheckCircle, { className: "text-green-600 text-2xl" })) : (_jsxs("button", { onClick: () => handleMarkAsDone(med.id), className: "bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all font-semibold text-lg flex items-center", children: [_jsx(FaCheckCircle, { className: "mr-2" }), " Mark as Done"] })) })] }, med.id))) }))] }), _jsxs("div", { className: "flex justify-between mt-6 mb-8", children: [_jsxs("button", { onClick: handlePreviousPrescription, disabled: currentPrescriptionIndex === 0, className: `py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${currentPrescriptionIndex === 0
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'}`, children: [_jsx(FaChevronCircleLeft, { className: "mr-2" }), " Previous Prescription"] }), _jsxs("button", { onClick: handleNextPrescription, disabled: currentPrescriptionIndex === prescriptions.length - 1 && allMedicationsCompleted(), className: `py-3 px-6 rounded-lg transition-all font-semibold text-lg flex items-center ${currentPrescriptionIndex === prescriptions.length - 1 && allMedicationsCompleted()
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'}`, children: [_jsx(FaChevronCircleRight, { className: "mr-2" }), currentPrescriptionIndex === prescriptions.length - 1
                                    ? 'Complete All Prescriptions'
                                    : 'Next Prescription'] })] }), _jsxs("div", { className: "bg-white shadow-lg rounded-xl p-6 mb-8", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4", children: "Prescription Queue Summary" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Prescription ID" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Patient Name" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Progress" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: prescriptions.map((prescription, index) => (_jsxs("tr", { className: index === currentPrescriptionIndex ? "bg-blue-50" : "", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: prescription.id }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500", children: prescription.patientName || 'N/A' }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prescription.completed
                                                            ? 'bg-green-100 text-green-800'
                                                            : index === currentPrescriptionIndex
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-gray-100 text-gray-800'}`, children: prescription.completed
                                                            ? 'Completed'
                                                            : index === currentPrescriptionIndex
                                                                ? 'In Progress'
                                                                : 'Pending' }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2.5", children: _jsx("div", { className: "bg-blue-600 h-2.5 rounded-full", style: { width: `${prescription.progress || 0}%` } }) }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [prescription.progress || 0, "%"] })] })] }, prescription.id))) })] }) })] })] }) }));
};
export default PharmacistPrescription;
