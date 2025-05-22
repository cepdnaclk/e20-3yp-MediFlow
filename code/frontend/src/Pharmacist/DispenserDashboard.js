import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import '../App.css';
import { Package, AlertCircle, Clock, Plus, RefreshCw, Pill } from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
const DispenserDashboard = () => {
    const medications = [
        { name: 'Amoxicillin', stock: 150, temperature: '70F', status: 'Running', type: 'antibiotic' },
        { name: 'Ibuprofen', stock: 200, temperature: '68F', status: 'Empty', type: 'fever' },
        { name: 'Paracetamol', stock: 1000, temperature: '72F', status: 'stopped', type: 'pain' },
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'Running': return 'text-green-700 ';
            case 'Empty': return 'text-yellow-700 ';
            default: return 'text-red-500 ';
        }
    };
    // Get animation based on medicine type
    const getMedicineAnimation = (type) => {
        switch (type) {
            case 'antibiotic':
                return (_jsxs("div", { className: "relative w-10 h-10 flex items-center justify-center", children: [_jsx(Pill, { className: "w-5 h-5 text-green-900" }), _jsx(motion.div, { className: "absolute inset-0 rounded-full border border-green-400", animate: {
                                scale: [1, 1.2, 1],
                                opacity: [1, 0.7, 1]
                            }, transition: {
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            } })] }));
            case 'pain':
                return (_jsxs("div", { className: "relative w-10 h-10 flex items-center justify-center", children: [_jsx(Pill, { className: "w-5 h-5 text-red-500" }), _jsx(motion.div, { className: "absolute inset-0 rounded-full border border-red-400" })] }));
            case 'fever':
                return (_jsxs("div", { className: "relative w-10 h-10 flex items-center justify-center", children: [_jsx(Pill, { className: "w-5 h-5 text-yellow-800" }), _jsx(motion.div, { className: "absolute inset-0 rounded-full border border-yellow-400", animate: {
                                scale: [1, 1.05, 1],
                                opacity: [1, 0.7, 1]
                            }, transition: {
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            } })] }));
            default:
                return _jsx(Pill, { className: "w-5 h-5 text-blue-500" });
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 300 }, children: _jsx(Card, { className: " shadow-lg", children: _jsxs(CardContent, { className: "flex items-center p-6", children: [_jsx(Package, { className: "w-10 h-10 text-black mr-4" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm", children: "Total Medicines" }), _jsx("h3", { className: "text-3xl font-bold", children: "250" })] })] }) }) }), _jsx(motion.div, { whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 300 }, children: _jsx(Card, { className: "bg-gradient-to-r from-gray-100 to-white-700 shadow-lg", children: _jsxs(CardContent, { className: "flex items-center p-6", children: [_jsx(Clock, { className: "w-10 h-10  mr-4" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm ", children: "Dispensed Today" }), _jsx("h3", { className: "text-3xl font-bold ", children: "45" })] })] }) }) }), _jsx(motion.div, { whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 300 }, children: _jsx(Card, { className: "bg-gradient-to-r from-red-50 to-white-100 shadow-lg", children: _jsxs(CardContent, { className: "flex items-center p-6", children: [_jsx(AlertCircle, { className: "w-10 h-10 text-red-500 mr-4" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-red-500 ", children: "Alerts" }), _jsx("h3", { className: "text-3xl font-bold text-red-500", children: "3" })] })] }) }) })] }), _jsxs(Card, { className: "bg-white shadow-xl rounded-lg overflow-hidden", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-blue-600 text-white", children: [_jsx(CardTitle, { className: "text-2xl font-semibold", children: "Medicine Stock" }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs(Button, { className: "bg-white text-black hover:text-white hover:bg-green-500", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Medicine"] }), _jsxs(Button, { variant: "outline", className: "text-blue-500 hover:text-white hover:bg-blue-500 border-blue-200", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Refresh Status"] })] })] }), _jsx(CardContent, { className: "p-6", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full table-auto", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left bg-blue-100", children: [_jsx("th", { className: "py-3 px-6 text-black-600", children: "Dispenser" }), _jsx("th", { className: "py-3 px-6 text-black-600", children: "Medicine Name" }), _jsx("th", { className: "py-3 px-6 text-black-600", children: "Stock Level" }), _jsx("th", { className: "py-3 px-6 text-black-600", children: "Temperature" }), _jsx("th", { className: "py-3 px-6 text-black-600", children: "Status" }), _jsx("th", { className: "py-3 px-6 text-black-600", children: "Actions" })] }) }), _jsx("tbody", { children: medications.map((med, idx) => (_jsxs(motion.tr, { className: "border-b hover:bg-blue-50", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.1 }, whileHover: { backgroundColor: "rgba(239, 246, 255, 0.8)" }, children: [_jsx("td", { className: "py-4 px-6", children: getMedicineAnimation(med.type) }), _jsx("td", { className: "py-4 px-6 font-medium text-blue-800", children: med.name }), _jsx("td", { className: "py-4 px-6", children: _jsx(motion.div, { className: "bg-blue-100 rounded-full h-6 overflow-hidden", initial: { width: 0 }, animate: { width: `${Math.min(100, med.stock / 2)}%` }, transition: { duration: 1, ease: "easeOut" }, children: _jsxs("div", { className: "bg-blue-500 h-full text-xs text-white flex items-center justify-center", children: [med.stock, " units"] }) }) }), _jsx("td", { className: "py-4 px-6", children: med.temperature }), _jsx("td", { className: "py-4 px-6", children: _jsx(motion.span, { className: `px-3 py-1 rounded-full text-sm ${getStatusColor(med.status)}`, whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, children: med.status.charAt(0).toUpperCase() + med.status.slice(1) }) }), _jsxs("td", { className: "py-4 px-6", children: [_jsx(Button, { variant: "outline", className: "mr-2 text-green-600 hover:bg-green-600 hover:text-white border-blue-200", children: "Dispense" }), _jsx(Button, { variant: "outline", className: "text-red-400 hover:bg-red-400 hover:text-white border-blue-200", children: "Stop" })] })] }, idx))) })] }) }) })] })] }) }));
};
export default DispenserDashboard;
