import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, CheckCircle, Lock, Upload, X, User, Mail, Phone, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.REACT_APP_API_URL;
const AdminRegistration = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nic: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        confirmPassword: '',
        permissions: {
            canRegisterPatients: true,
            canRegisterDoctors: false,
            canRegisterPharmacists: false,
            canRegisterAdmins: false
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handlePermissionChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            permissions: {
                ...formData.permissions,
                [name]: checked
            }
        });
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
            // Include photo with the admin data
            const adminData = {
                ...formData,
                photo: photoPreview
            };
            // Make API call to register admin
            const response = await fetch('${API_URL}/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    username: formData.username,
                    password: formData.password,
                    photo: photoPreview,
                    role: 'admin',
                    permissions: formData.permissions
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
                    username: '',
                    password: '',
                    confirmPassword: '',
                    permissions: {
                        canRegisterPatients: true,
                        canRegisterDoctors: false,
                        canRegisterPharmacists: false,
                        canRegisterAdmins: false
                    }
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
            console.error('Error registering admin:', error);
            alert('Failed to register admin. Please try again.');
        }
        setIsSubmitting(false);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-8", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsxs(motion.button, { onClick: () => navigate('/admin_dashboard'), className: "flex items-center text-gray-600 hover:text-red-600 transition-colors mb-8", whileHover: { x: -5 }, children: [_jsx(ArrowLeft, { className: "mr-2 h-5 w-5" }), " Back to Dashboard"] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "bg-white rounded-2xl shadow-xl overflow-hidden", children: [_jsx("div", { className: "px-6 py-8 bg-gradient-to-r from-red-500 to-orange-500 sm:px-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "p-3 bg-white rounded-full", children: _jsx(Shield, { className: "h-8 w-8 text-red-500" }) }), _jsx("h1", { className: "text-2xl font-bold text-white", children: "Register New Administrator" })] }), _jsx("span", { className: "bg-red-700/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white", children: "Admin Access" })] }) }), _jsx("div", { className: "px-6 py-8 sm:px-10", children: isSuccess ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", stiffness: 200, damping: 10 }, className: "flex justify-center mb-6", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-75 blur-sm" }), _jsx("div", { className: "relative bg-white p-4 rounded-full", children: _jsx(CheckCircle, { className: "w-16 h-16 text-green-500" }) })] }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Registration Successful!" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Administrator has been registered successfully." }), _jsx("div", { className: "flex justify-center", children: _jsx("span", { className: "bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm", children: "Redirecting to dashboard..." }) })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-8 p-6 bg-red-50 rounded-xl", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "relative", children: photoPreview ? (_jsxs("div", { className: "relative w-40 h-40 rounded-xl overflow-hidden border-4 border-white shadow-lg", children: [_jsx("img", { src: photoPreview, alt: "Admin preview", className: "w-full h-full object-cover" }), _jsx("button", { type: "button", onClick: removePhoto, className: "absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center w-40 h-40 bg-white rounded-xl border-4 border-white shadow-lg", children: [_jsx(User, { className: "h-12 w-12 text-gray-400 mb-2" }), _jsx("span", { className: "text-sm text-gray-500", children: "No photo" })] })) }) }), _jsxs("div", { className: "flex-grow", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Administrator Photo" }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: "Upload a professional photo for identification purposes." }), _jsx("input", { type: "file", ref: fileInputRef, accept: "image/*", onChange: handlePhotoUpload, className: "hidden" }), _jsxs(motion.button, { type: "button", onClick: () => fileInputRef.current.click(), className: "flex items-center px-4 py-2.5 bg-white border border-red-300 rounded-lg text-red-600 shadow-sm hover:bg-red-50 transition-all", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), photoPreview ? 'Change Photo' : 'Upload Photo'] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4", children: [_jsx(User, { className: "h-5 w-5 text-red-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Personal Information" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["First Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "firstName", value: formData.firstName, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Last Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "lastName", value: formData.lastName, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["NIC Number", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "nic", value: formData.nic, onChange: handleChange, required: true, pattern: "^([0-9]{9}[vVxX]|[0-9]{12})$", className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(BadgeCheck, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700", children: ["Email ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Mail, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Phone Number" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Phone, { className: "h-4 w-4 text-gray-400" }) })] })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4", children: [_jsx(Lock, { className: "h-5 w-5 text-red-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Admin Permissions" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center p-3 bg-white rounded-md border border-gray-200 hover:border-red-200 transition-colors", children: [_jsx("input", { type: "checkbox", id: "canRegisterPatients", name: "canRegisterPatients", checked: formData.permissions.canRegisterPatients, onChange: handlePermissionChange, className: "rounded text-red-600 focus:ring-red-500 h-4 w-4" }), _jsx("label", { htmlFor: "canRegisterPatients", className: "ml-2 text-sm text-gray-700", children: "Can register patients" })] }), _jsxs("div", { className: "flex items-center p-3 bg-white rounded-md border border-gray-200 hover:border-red-200 transition-colors", children: [_jsx("input", { type: "checkbox", id: "canRegisterDoctors", name: "canRegisterDoctors", checked: formData.permissions.canRegisterDoctors, onChange: handlePermissionChange, className: "rounded text-red-600 focus:ring-red-500 h-4 w-4" }), _jsx("label", { htmlFor: "canRegisterDoctors", className: "ml-2 text-sm text-gray-700", children: "Can register doctors" })] }), _jsxs("div", { className: "flex items-center p-3 bg-white rounded-md border border-gray-200 hover:border-red-200 transition-colors", children: [_jsx("input", { type: "checkbox", id: "canRegisterPharmacists", name: "canRegisterPharmacists", checked: formData.permissions.canRegisterPharmacists, onChange: handlePermissionChange, className: "rounded text-red-600 focus:ring-red-500 h-4 w-4" }), _jsx("label", { htmlFor: "canRegisterPharmacists", className: "ml-2 text-sm text-gray-700", children: "Can register pharmacists" })] }), _jsxs("div", { className: "flex items-center p-3 bg-white rounded-md border border-gray-200 hover:border-red-200 transition-colors", children: [_jsx("input", { type: "checkbox", id: "canRegisterAdmins", name: "canRegisterAdmins", checked: formData.permissions.canRegisterAdmins, onChange: handlePermissionChange, className: "rounded text-red-600 focus:ring-red-500 h-4 w-4" }), _jsx("label", { htmlFor: "canRegisterAdmins", className: "ml-2 text-sm text-gray-700", children: "Can register other admins" })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm", children: [_jsxs("div", { className: "flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4", children: [_jsx(Lock, { className: "h-5 w-5 text-red-500" }), _jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Account Credentials" })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Username ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", name: "username", value: formData.username, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(User, { className: "h-4 w-4 text-gray-400" }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, minLength: 6, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Lock, { className: "h-4 w-4 text-gray-400" }) })] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Password must be at least 6 characters" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Confirm Password ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, required: true, className: "w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all" }), _jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: _jsx(Lock, { className: "h-4 w-4 text-gray-400" }) })] })] })] })] })] }), _jsx("div", { className: "pt-4", children: _jsx(motion.button, { type: "submit", className: "w-full flex justify-center items-center p-3.5 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors", disabled: isSubmitting, whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-5 w-5 mr-3 text-white", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Registering..."] })) : (_jsx(_Fragment, { children: "Register Administrator" })) }) })] })) })] })] }) }));
};
export default AdminRegistration;
