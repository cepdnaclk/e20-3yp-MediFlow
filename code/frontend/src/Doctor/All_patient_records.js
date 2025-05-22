import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, FileText, Calendar, Plus, Filter, Eye, Edit, MoreVertical, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent } from '@radix-ui/react-tabs';
import { Button } from '../components/ui/button.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';
const PatientRecords = () => {
    const [activeTab, setActiveTab] = useState("records");
    const [hoveredRow, setHoveredRow] = useState(null);
    const patients = [
        {
            id: 1,
            name: 'John Doe',
            avatar: '/avatar.png',
            age: 45,
            condition: 'Hypertension',
            status: 'Active',
            lastVisit: '2025-02-10',
            doctor: 'Dr. Smith',
            upcomingAppointment: '2025-03-05',
        },
        {
            id: 2,
            name: 'Jane Smith',
            avatar: '/avatar.png',
            age: 32,
            condition: 'Diabetes Type 2',
            status: 'Review Needed',
            lastVisit: '2025-02-12',
            doctor: 'Dr. Johnson',
            upcomingAppointment: '2025-02-28',
        },
        {
            id: 3,
            name: 'Robert Williams',
            avatar: '/avatar.png',
            age: 58,
            condition: 'Arthritis',
            status: 'Critical',
            lastVisit: '2025-02-20',
            doctor: 'Dr. Garcia',
            upcomingAppointment: '2025-02-27',
        },
        {
            id: 4,
            name: 'Emily Chen',
            avatar: '/avatar.png',
            age: 29,
            condition: 'Asthma',
            status: 'Stable',
            lastVisit: '2025-02-15',
            doctor: 'Dr. Martinez',
            upcomingAppointment: '2025-03-10',
        },
    ];
    const statusColors = {
        'Active': 'bg-green-100 text-green-800',
        'Review Needed': 'bg-amber-100 text-amber-800',
        'Critical': 'bg-red-100 text-red-800',
        'Stable': 'bg-blue-100 text-blue-800',
    };
    const getStatusClass = (status) => {
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };
    const handleTabChange = (value) => {
        setActiveTab(value);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [_jsx(motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.5 }, className: "bg-white border-b shadow-sm sticky top-0 z-10" }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(Tabs, { defaultValue: "records", value: activeTab, onValueChange: handleTabChange, className: "space-y-6", children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: [_jsx(TabsContent, { value: "records", children: _jsxs(Card, { className: "overflow-hidden border-none shadow-lg", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between bg-white px-6 py-5", children: [_jsx(CardTitle, { className: "font-bold text-gray-800", children: "Patient Records" }), _jsxs("div", { className: "flex space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Search patients...", className: "pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all duration-200" })] }), _jsxs(Button, { variant: "outline", className: "rounded-full border border-gray-200 hover:bg-gray-50 transition-colors", children: [_jsx(Filter, { className: "w-4 h-4 mr-2 text-gray-500" }), "Filters"] })] })] }), _jsxs(CardContent, { className: "bg-white p-0", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 border-y", children: [_jsx("th", { className: "text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold", children: "Patient" }), _jsx("th", { className: "text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold", children: "Age" }), _jsx("th", { className: "text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold", children: "Condition" }), _jsx("th", { className: "text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold", children: "Status" }), _jsx("th", { className: "text-left py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold", children: "Last Visit" }), _jsx("th", { className: "text-right py-4 px-6 text-xs uppercase tracking-wider text-gray-500 font-semibold", children: "Actions" })] }) }), _jsx("tbody", { children: patients.map((patient, idx) => (_jsxs(motion.tr, { className: `border-b hover:bg-gray-50 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`, onMouseEnter: () => setHoveredRow(patient.id), onMouseLeave: () => setHoveredRow(null), whileHover: { backgroundColor: "rgba(249, 250, 251, 1)" }, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: idx * 0.05 }, children: [_jsx("td", { className: "py-4 px-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-200", children: _jsx("img", { src: patient.avatar, alt: `${patient.name} avatar`, className: "h-full w-full object-cover" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-800", children: patient.name }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Next appointment: ", patient.upcomingAppointment] })] })] }) }), _jsx("td", { className: "py-4 px-6 text-gray-600", children: patient.age }), _jsx("td", { className: "py-4 px-6 text-gray-600", children: patient.condition }), _jsx("td", { className: "py-4 px-6", children: _jsx("span", { className: `text-xs px-2 py-1 rounded-full ${getStatusClass(patient.status)}`, children: patient.status }) }), _jsx("td", { className: "py-4 px-6 text-gray-600", children: patient.lastVisit }), _jsx("td", { className: "py-4 px-6 text-right", children: _jsxs("div", { className: "flex items-center justify-end space-x-2", children: [_jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Button, { variant: "outline", size: "sm", className: "border border-gray-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors", children: [_jsx(Eye, { className: "w-3.5 h-3.5 mr-1" }), "View"] }) }), _jsx(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: _jsxs(Button, { variant: "outline", size: "sm", className: "border border-gray-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors", children: [_jsx(Edit, { className: "w-3.5 h-3.5 mr-1" }), "Edit"] }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-gray-400 hover:text-gray-500 p-1", children: _jsx(MoreVertical, { className: "w-4 h-4" }) })] }) })] }, patient.id))) })] }) }), _jsxs("div", { className: "p-4 border-t flex items-center justify-between text-sm text-gray-500", children: [_jsxs("div", { children: ["Showing 1-", patients.length, " of ", patients.length, " patients"] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "outline", size: "sm", className: "h-8 w-8 p-0 flex items-center justify-center", children: "1" }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 flex items-center justify-center", children: "2" }), _jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 flex items-center justify-center", children: "3" }), _jsx(ChevronRight, { className: "w-4 h-4" })] })] })] })] }) }), _jsx(TabsContent, { value: "prescriptions", children: _jsx(Card, { className: "border-none shadow-lg", children: _jsx(CardContent, { className: "p-8", children: _jsx("div", { className: "flex items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-200", children: _jsxs("div", { className: "text-center", children: [_jsx(FileText, { className: "w-12 h-12 mx-auto mb-4 text-gray-300" }), _jsx("h3", { className: "text-lg font-medium text-gray-800 mb-2", children: "Prescriptions Management" }), _jsx("p", { className: "text-gray-500 mb-4", children: "View and manage patient prescriptions here." }), _jsxs(Button, { className: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Prescription"] })] }) }) }) }) }), _jsx(TabsContent, { value: "appointments", children: _jsx(Card, { className: "border-none shadow-lg", children: _jsx(CardContent, { className: "p-8", children: _jsx("div", { className: "flex items-center justify-center p-12 bg-gray-50 rounded-lg border border-dashed border-gray-200", children: _jsxs("div", { className: "text-center", children: [_jsx(Calendar, { className: "w-12 h-12 mx-auto mb-4 text-gray-300" }), _jsx("h3", { className: "text-lg font-medium text-gray-800 mb-2", children: "Appointments Calendar" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Manage patient appointments here." }), _jsxs(Button, { className: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Schedule Appointment"] })] }) }) }) }) })] }, activeTab) }) }) })] }));
};
export default PatientRecords;
