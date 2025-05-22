import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaArrowLeft, FaPills, FaExclamationCircle, FaPlusCircle, FaTimes, FaPrint } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
const API_URL = import.meta.env.REACT_APP_API_URL;
const PatientProfile = () => {
    const [medications, setMedications] = useState([{ id: 1, name: 'Amoxicillin', dosage: '250mg', frequency: 'Once daily', duration: '7 days' }]);
    const [diagnosis, setDiagnosis] = useState('');
    const [prescriptionDate, setPrescriptionDate] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const patient = location.state?.patient;
    if (!patient) {
        return _jsx("div", { children: "No patient data found. Please scan again." });
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
    const handleRemoveMedication = (id) => {
        setMedications(medications.filter((med) => med.id !== id));
    };
    const calculateQuantity = (frequency, duration) => {
        const frequencyMap = {
            'Once daily': 1,
            'Twice daily': 2,
            'Three times daily': 3,
        };
        const durationMap = {
            '3 days': 3,
            '5 days': 5,
            '7 days': 7,
            '1 month': 30,
        };
        return frequencyMap[frequency] * durationMap[duration];
    };
    const handleSubmit = async (event) => {
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
            const response = await fetch('${API_URL}/api/prescriptions', {
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
            }
            else {
                // Handle specific status codes
                if (response.status === 401) {
                    console.error('Authentication expired. Please login again.');
                    navigate('/login');
                }
                else if (response.status === 403) {
                    console.error('You do not have permission to create prescriptions');
                }
                else {
                    const errorData = await response.json();
                    console.error('Failed to save prescription:', errorData.message);
                }
            }
        }
        catch (error) {
            console.error('Error saving prescription:', error);
        }
    };
    return (_jsx("div", { className: "bg-gray-50 min-h-screen py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "bg-white border-b mb-8", children: _jsxs("div", { className: "flex justify-between h-16 items-center", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { className: "text-lg text-blue-600 font-semibold hover:text-blue-800", children: [_jsx(FaArrowLeft, { className: "inline mr-2" }), " Back"] }), _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Patient Profile" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("span", { className: "text-base text-gray-600", children: ["Patient ID: ", patient.id] }), _jsx("button", { className: "text-base bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-all font-semibold", children: "Edit Profile" })] })] }) }), _jsxs("div", { className: "bg-white shadow-lg rounded-xl p-8 mb-8 transition-all ", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(FaPills, { className: "text-3xl text-blue-600 mr-4" }), _jsx("h3", { className: "text-2xl font-semibold text-gray-800", children: "New Prescription" })] }), _jsxs("form", { className: "space-y-8", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "Patient Information" }), _jsxs("div", { className: "space-y-2 text-base text-gray-600", children: [_jsxs("p", { children: [_jsx("strong", { children: "Name:" }), " ", patient.firstName, " ", patient.lastName] }), _jsxs("p", { children: [_jsx("strong", { children: "Age:" }), " ", patient.age, " years"] }), _jsxs("div", { className: "flex items-center", children: [_jsx(FaExclamationCircle, { className: "text-red-500 mr-2" }), _jsxs("p", { children: [_jsx("strong", { children: "Allergies:" }), " ", Array.isArray(patient.allergies) ? patient.allergies.join(', ') : (patient.allergies || 'None')] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700 mb-4", children: "Prescription Details" }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "date", className: "w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600", value: prescriptionDate, onChange: (e) => setPrescriptionDate(e.target.value) }), _jsxs("select", { className: "w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600", value: diagnosis, onChange: (e) => setDiagnosis(e.target.value), children: [_jsx("option", { value: "", children: "Select Diagnosis" }), _jsx("option", { value: "Hypertension", children: "Hypertension" }), _jsx("option", { value: "Diabetes", children: "Diabetes" }), _jsx("option", { value: "Other", children: "Other" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-700", children: "Medications" }), _jsx("button", { type: "button", onClick: handleAddMedication, className: "text-lg bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all font-semibold ", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(FaPlusCircle, { className: "mr-2" }), " Add Medication"] }) })] }), medications.map((med, index) => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-8 p-6 bg-gray-100 rounded-xl relative transition-all hover:bg-gray-200", children: [_jsx("button", { type: "button", onClick: () => handleRemoveMedication(med.id), className: "absolute top-0 right-0 p-2 bg-white rounded-full text-gray-500 hover:text-red-600", children: _jsx(FaTimes, { className: "text-lg" }) }), _jsxs("select", { className: "w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600", value: med.name, onChange: (e) => {
                                                        const newMedications = [...medications];
                                                        newMedications[index].name = e.target.value;
                                                        setMedications(newMedications);
                                                    }, children: [_jsx("option", { value: "Amoxicillin", children: "Amoxicillin" }), _jsx("option", { value: "Metformin", children: "Metformin" }), _jsx("option", { value: "Lisinopril", children: "Lisinopril" })] }), _jsxs("select", { className: "w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600", value: med.dosage, onChange: (e) => {
                                                        const newMedications = [...medications];
                                                        newMedications[index].dosage = e.target.value;
                                                        setMedications(newMedications);
                                                    }, children: [_jsx("option", { value: "250mg", children: "250mg" }), _jsx("option", { value: "500mg", children: "500mg" }), _jsx("option", { value: "1000mg", children: "1000mg" })] }), _jsxs("select", { className: "w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600", value: med.frequency, onChange: (e) => {
                                                        const newMedications = [...medications];
                                                        newMedications[index].frequency = e.target.value;
                                                        setMedications(newMedications);
                                                    }, children: [_jsx("option", { value: "Once daily", children: "Once daily" }), _jsx("option", { value: "Twice daily", children: "Twice daily" }), _jsx("option", { value: "Three times daily", children: "Three times daily" })] }), _jsxs("select", { className: "w-full p-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-600", value: med.duration, onChange: (e) => {
                                                        const newMedications = [...medications];
                                                        newMedications[index].duration = e.target.value;
                                                        setMedications(newMedications);
                                                    }, children: [_jsx("option", { value: "3 days", children: "3 days" }), _jsx("option", { value: "5 days", children: "5 days" }), _jsx("option", { value: "7 days", children: "7 days" }), _jsx("option", { value: "1 month", children: "1 month" })] })] }, med.id)))] }), _jsxs("div", { className: "flex items-center space-x-6 pt-6 border-t-2", children: [_jsx("button", { id: 'submit', type: "submit", className: "w-full md:w-auto bg-blue-600 text-white py-4 px-8 rounded-xl hover:bg-blue-700 transition-all font-semibold text-lg", children: "Submit" }), _jsxs("button", { type: "button", className: "w-full md:w-auto border border-gray-300 text-gray-700 py-4 px-8 rounded-xl hover:border-gray-400 transition-all font-semibold text-lg", children: [_jsx(FaPrint, { className: "mr-2" }), " Print Prescription"] })] })] })] })] }) }));
};
export default PatientProfile;
