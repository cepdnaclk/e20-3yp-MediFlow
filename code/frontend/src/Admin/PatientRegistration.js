import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UserPlus, AlertCircle, Upload, CreditCard, Calendar, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.REACT_APP_API_URL;
const RegisterPatient = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    // Set card issue date to current date by default
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nic: '',
        gender: 'male',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
        bloodType: '',
        allergies: '',
        medicalConditions: '',
        height: '',
        weight: '',
        rfidCardUID: '',
        cardIssueDate: today,
        cardStatus: 'active'
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            // Create FormData object for multipart/form-data upload
            const formDataToSend = new FormData();
            // Add all form data fields
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            // Add the photo file if it exists
            if (fileInputRef.current && fileInputRef.current.files[0]) {
                formDataToSend.append('photo', fileInputRef.current.files[0]);
            }
            const response = await fetch('${API_URL}/api/patients', {
                method: 'POST',
                headers: {
                    // Don't set Content-Type when sending FormData
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });
            console.log(response);
            if (!response.ok)
                throw new Error('Failed to register patient');
            const data = await response.json();
            setSuccessMessage(`Patient ${formData.firstName} ${formData.lastName} registered successfully with RFID card!`);
            // Reset the form
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                nic: '',
                gender: 'male',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                emergencyContactName: '',
                emergencyContactPhone: '',
                emergencyContactRelationship: '',
                bloodType: '',
                allergies: '',
                medicalConditions: '',
                height: '',
                weight: '',
                rfidCardUID: '',
                cardIssueDate: today,
                cardStatus: 'active'
            });
            setPhotoPreview(null);
        }
        catch (error) {
            setErrorMessage(error.message || 'An error occurred while registering the patient');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsx("div", { className: "mb-8", children: _jsxs(motion.button, { onClick: () => navigate('/admin_dashboard'), className: "flex items-center text-gray-600 hover:text-blue-600 transition-colors", whileHover: { x: -5 }, children: [_jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }), " Back to Dashboard"] }) }), _jsxs(motion.div, { className: "bg-white rounded-2xl shadow-xl overflow-hidden", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("div", { className: "px-6 py-8 bg-gradient-to-r from-blue-500 to-blue-600 sm:px-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "p-3 bg-white rounded-full", children: _jsx(UserPlus, { className: "h-8 w-8 text-blue-500" }) }), _jsx("h1", { className: "text-2xl font-bold text-white", children: "Register New Patient" })] }), _jsx("span", { className: "bg-blue-700 px-3 py-1 rounded-full text-xs font-medium text-white", children: "RFID Enabled" })] }) }), _jsxs("div", { className: "px-6 py-8 sm:px-10", children: [successMessage && (_jsxs(motion.div, { className: "mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, children: [_jsx("span", { className: "flex-shrink-0 mr-2", children: "\u2713" }), successMessage] })), errorMessage && (_jsxs(motion.div, { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2 flex-shrink-0" }), errorMessage] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-8 p-6 bg-blue-50 rounded-xl", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "relative", children: photoPreview ? (_jsxs("div", { className: "relative w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg", children: [_jsx("img", { src: photoPreview, alt: "Patient preview", className: "w-full h-full object-cover" }), _jsx("button", { type: "button", onClick: removePhoto, className: "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center w-40 h-40 bg-gray-100 rounded-xl border-4 border-white shadow-lg", children: [_jsx(Camera, { className: "h-12 w-12 text-gray-400 mb-2" }), _jsx("span", { className: "text-sm text-gray-500", children: "No photo" })] })) }) }), _jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Patient Photo" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Upload a clear photo of the patient for identification purposes." }), _jsx("input", { type: "file", ref: fileInputRef, accept: "image/*", onChange: handlePhotoUpload, className: "hidden" }), _jsxs(motion.button, { type: "button", onClick: () => fileInputRef.current.click(), className: "flex items-center px-4 py-2.5 bg-white border border-blue-300 rounded-lg text-blue-600 shadow-sm hover:bg-blue-50 transition-all", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), photoPreview ? 'Change Photo' : 'Upload Photo'] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b pb-2", children: [_jsx(CreditCard, { className: "h-5 w-5 text-blue-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "RFID Card Details" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "rfidCardUID", className: "block text-sm font-medium text-gray-700 mb-1", children: ["RFID Card UID ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "rfidCardUID", name: "rfidCardUID", value: formData.rfidCardUID, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", placeholder: "Scan or enter card UID" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "cardIssueDate", className: "block text-sm font-medium text-gray-700 mb-1", children: "Card Issue Date" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Calendar, { className: "h-4 w-4 text-gray-400" }) }), _jsx("input", { type: "date", id: "cardIssueDate", name: "cardIssueDate", value: formData.cardIssueDate, onChange: handleChange, className: "w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "cardStatus", className: "block text-sm font-medium text-gray-700 mb-1", children: "Card Status" }), _jsxs("select", { id: "cardStatus", name: "cardStatus", value: formData.cardStatus, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", children: [_jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" }), _jsx("option", { value: "pending", children: "Pending Activation" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b pb-2", children: [_jsx(UserPlus, { className: "h-5 w-5 text-blue-500" }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Personal Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700 mb-1", children: ["First Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Last Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "dateOfBirth", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Date of Birth ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", id: "dateOfBirth", name: "dateOfBirth", value: formData.dateOfBirth, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "nic", className: "block text-sm font-medium text-gray-700 mb-1", children: "NIC Number" }), _jsx("input", { type: "text", id: "nic", name: "nic", value: formData.nic, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "gender", className: "block text-sm font-medium text-gray-700 mb-1", children: "Gender" }), _jsxs("select", { id: "gender", name: "gender", value: formData.gender, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", children: [_jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "height", className: "block text-sm font-medium text-gray-700 mb-1", children: "Height (cm)" }), _jsx("input", { type: "number", id: "height", name: "height", value: formData.height, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "weight", className: "block text-sm font-medium text-gray-700 mb-1", children: "Weight (kg)" }), _jsx("input", { type: "number", id: "weight", name: "weight", value: formData.weight, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b pb-2", children: [_jsx("svg", { className: "h-5 w-5 text-blue-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Contact Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Phone Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", id: "phone", name: "phone", value: formData.phone, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsxs("label", { htmlFor: "address", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Address ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "address", name: "address", value: formData.address, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "city", className: "block text-sm font-medium text-gray-700 mb-1", children: ["City ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "city", name: "city", value: formData.city, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "state", className: "block text-sm font-medium text-gray-700 mb-1", children: "Province" }), _jsx("input", { type: "text", id: "state", name: "state", value: formData.state, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "zipCode", className: "block text-sm font-medium text-gray-700 mb-1", children: "Zip Code" }), _jsx("input", { type: "text", id: "zipCode", name: "zipCode", value: formData.zipCode, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b pb-2", children: [_jsx("svg", { className: "h-5 w-5 text-blue-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Emergency Contact" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "emergencyContactName", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "emergencyContactName", name: "emergencyContactName", value: formData.emergencyContactName, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "emergencyContactPhone", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Phone Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "tel", id: "emergencyContactPhone", name: "emergencyContactPhone", value: formData.emergencyContactPhone, onChange: handleChange, required: true, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "emergencyContactRelationship", className: "block text-sm font-medium text-gray-700 mb-1", children: ["Relationship ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", id: "emergencyContactRelationship", name: "emergencyContactRelationship", value: formData.emergencyContactRelationship, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b pb-2", children: [_jsx("svg", { className: "h-5 w-5 text-blue-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-800", children: "Medical Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "bloodType", className: "block text-sm font-medium text-gray-700 mb-1", children: "Blood Type" }), _jsxs("select", { id: "bloodType", name: "bloodType", value: formData.bloodType, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", children: [_jsx("option", { value: "", children: "Select Blood Type" }), _jsx("option", { value: "A+", children: "A+" }), _jsx("option", { value: "A-", children: "A-" }), _jsx("option", { value: "B+", children: "B+" }), _jsx("option", { value: "B-", children: "B-" }), _jsx("option", { value: "AB+", children: "AB+" }), _jsx("option", { value: "AB-", children: "AB-" }), _jsx("option", { value: "O+", children: "O+" }), _jsx("option", { value: "O-", children: "O-" })] })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { htmlFor: "allergies", className: "block text-sm font-medium text-gray-700 mb-1", children: "Allergies (if any, separate with commas)" }), _jsx("input", { type: "text", id: "allergies", name: "allergies", value: formData.allergies, onChange: handleChange, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all", placeholder: "Penicillin, Peanuts, etc." })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { htmlFor: "medicalConditions", className: "block text-sm font-medium text-gray-700 mb-1", children: "Pre-existing Medical Conditions" }), _jsx("textarea", { id: "medicalConditions", name: "medicalConditions", value: formData.medicalConditions, onChange: handleChange, rows: 3, className: "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" })] })] })] }), _jsx("div", { className: "pt-6", children: _jsxs(motion.button, { type: "submit", disabled: isLoading, className: "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, children: [isLoading ? (_jsxs("svg", { className: "animate-spin h-5 w-5 mr-3 text-white", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] })) : (_jsx(Save, { className: "h-5 w-5 mr-2" })), isLoading ? 'Registering...' : 'Register Patient & Assign RFID Card'] }) })] })] })] })] }) }));
};
export default RegisterPatient;
