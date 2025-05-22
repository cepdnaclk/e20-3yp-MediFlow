import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Database, ArrowLeft, CheckCircle, Upload, X, Pill, BadgeCheck, User, Phone, Mail, Lock, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.REACT_APP_API_URL;
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
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
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
        // Validate the form data
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            setIsSubmitting(false);
            return;
        }
        try {
            // In a real app, include the photo data
            const pharmacistData = {
                ...formData,
                photo: photoPreview
            };
            // Make API call to register pharmacist
            // Replace with your actual API endpoint
            const response = await fetch('${API_URL}/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    ...pharmacistData,
                    role: 'pharmacist'
                })
            });
            if (response.ok) {
                setIsSuccess(true);
                // Reset form
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
                    username: '',
                    password: '',
                    confirmPassword: ''
                });
                setPhotoPreview(null);
                // Show success message for 2 seconds then navigate back
                setTimeout(() => {
                    navigate('/admin_dashboard');
                }, 2000);
            }
            else {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message}`);
            }
        }
        catch (error) {
            console.error('Error registering pharmacist:', error);
            alert('Failed to register pharmacist. Please try again.');
        }
        setIsSubmitting(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsxs(motion.button, { onClick: () => navigate('/admin_dashboard'), className: "flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6", whileHover: { x: -5 }, children: [_jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }), " Back to Dashboard"] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "bg-white rounded-2xl shadow-xl overflow-hidden", children: [_jsx("div", { className: "px-6 py-8 bg-gradient-to-r from-purple-500 to-indigo-600 sm:px-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "p-3 bg-white rounded-full", children: _jsx(Database, { className: "h-8 w-8 text-purple-500" }) }), _jsx("h1", { className: "text-2xl font-bold text-white", children: "Register New Pharmacist" })] }), _jsx("span", { className: "bg-purple-700/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white", children: "Healthcare Professional" })] }) }), _jsx("div", { className: "px-6 py-8 sm:px-10", children: isSuccess ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", stiffness: 200, damping: 10 }, className: "flex justify-center mb-6", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -inset-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-75 blur-sm" }), _jsx("div", { className: "relative bg-white p-4 rounded-full", children: _jsx(CheckCircle, { className: "w-16 h-16 text-green-500" }) })] }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Registration Successful!" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Pharmacist has been registered successfully." }), _jsx("div", { className: "flex justify-center", children: _jsx("span", { className: "bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm", children: "Redirecting to dashboard..." }) })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-8 p-6 bg-purple-50 rounded-xl", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "relative", children: photoPreview ? (_jsxs("div", { className: "relative w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg", children: [_jsx("img", { src: photoPreview, alt: "Pharmacist preview", className: "w-full h-full object-cover" }), _jsx("button", { type: "button", onClick: removePhoto, className: "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center w-40 h-40 bg-white rounded-xl border-4 border-white shadow-lg", children: [_jsx(User, { className: "h-12 w-12 text-gray-400 mb-2" }), _jsx("span", { className: "text-sm text-gray-500", children: "No photo" })] })) }) }), _jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pharmacist Photo" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Upload a professional photo for identification purposes." }), _jsx("input", { type: "file", ref: fileInputRef, accept: "image/*", onChange: handlePhotoUpload, className: "hidden" }), _jsxs(motion.button, { type: "button", onClick: () => fileInputRef.current.click(), className: "flex items-center px-4 py-2.5 bg-white border border-purple-300 rounded-lg text-purple-600 shadow-sm hover:bg-purple-50 transition-all", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), photoPreview ? 'Change Photo' : 'Upload Photo'] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4", children: [_jsx(User, { className: "h-5 w-5 text-purple-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Personal Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["First Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Last Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["NIC Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "nic", value: formData.nic, onChange: handleChange, required: true, pattern: "^([0-9]{9}[vVxX]|[0-9]{12})$", className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(BadgeCheck, { className: "h-4 w-4 text-gray-400" }) })] })] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4", children: [_jsx(Mail, { className: "h-5 w-5 text-purple-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Contact Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Mail, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Phone Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Phone, { className: "h-4 w-4 text-gray-400" }) })] })] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4", children: [_jsx(Briefcase, { className: "h-5 w-5 text-purple-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Professional Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Specialization" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { name: "specialization", value: formData.specialization, onChange: handleChange, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all", children: [_jsx("option", { value: "", children: "Select Specialization" }), _jsx("option", { value: "Clinical Pharmacy", children: "Clinical Pharmacy" }), _jsx("option", { value: "Community Pharmacy", children: "Community Pharmacy" }), _jsx("option", { value: "Hospital Pharmacy", children: "Hospital Pharmacy" }), _jsx("option", { value: "Pharmacy Informatics", children: "Pharmacy Informatics" }), _jsx("option", { value: "Geriatric Pharmacy", children: "Geriatric Pharmacy" }), _jsx("option", { value: "Oncology Pharmacy", children: "Oncology Pharmacy" }), _jsx("option", { value: "Nuclear Pharmacy", children: "Nuclear Pharmacy" }), _jsx("option", { value: "Other", children: "Other" })] }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Pill, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["License Number ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "licenseNumber", value: formData.licenseNumber, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(BadgeCheck, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Work Experience (Years)" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", name: "workExperience", value: formData.workExperience, onChange: handleChange, min: "0", className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Briefcase, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Pharmacy Name" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "pharmacyName", value: formData.pharmacyName, onChange: handleChange, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Database, { className: "h-4 w-4 text-gray-400" }) })] })] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-2 mb-4", children: [_jsx(Lock, { className: "h-5 w-5 text-purple-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Account Credentials" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Username ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "username", value: formData.username, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, minLength: 6, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Lock, { className: "h-4 w-4 text-gray-400" }) })] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Password must be at least 6 characters" })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Confirm Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Lock, { className: "h-4 w-4 text-gray-400" }) })] })] })] })] })] }), _jsx("div", { className: "pt-6", children: _jsx(motion.button, { type: "submit", className: "w-full flex justify-center items-center p-3 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors", disabled: isSubmitting, whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-5 w-5 mr-3 text-white", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Registering..."] })) : (_jsx(_Fragment, { children: "Register Pharmacist" })) }) })] })) })] })] }) }));
};
export default PharmacistRegistration;
