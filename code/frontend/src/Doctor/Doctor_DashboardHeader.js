import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronDown, PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { motion } from "framer-motion";
import { Card, CardContent } from '../components/ui/card.js';
import { useNavigate } from 'react-router-dom';
const DoctorDashboardHeader = ({ user }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        // Set greeting based on time of day
        const hour = currentTime.getHours();
        if (hour < 12) {
            setGreeting("Good morning");
        }
        else if (hour < 18) {
            setGreeting("Good afternoon");
        }
        else {
            setGreeting("Good evening");
        }
        return () => clearInterval(timer);
    }, [currentTime]);
    // Format date
    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // Format time
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    // Upcoming appointments for today
    const upcomingAppointments = [
        { time: "10:30 AM", patient: "John Doe", type: "Check-up" },
        { time: "1:15 PM", patient: "Emily Chen", type: "Follow-up" },
        { time: "3:00 PM", patient: "Robert Williams", type: "Consultation" }
    ];
    return (_jsx("div", { className: "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 mt-6", children: _jsx(Card, { className: "border border-gray-200 overflow-hidden shadow-md rounded-xl", children: _jsx(CardContent, { className: "p-0", children: _jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "p-6 bg-gradient-to-br from-white to-indigo-50/30", children: _jsxs("div", { className: "flex flex-col lg:flex-row justify-between", children: [_jsxs("div", { className: "mb-6 lg:mb-0", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(CalendarIcon, { className: "w-5 h-5 mr-2 text-indigo-600" }), _jsx("h2", { className: "text-lg font-medium text-gray-800", children: formattedDate })] }), _jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Clock, { className: "w-5 h-5 mr-2 text-indigo-600" }), _jsx("div", { className: "text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent", children: formattedTime })] }), _jsxs("p", { className: "text-gray-600 text-lg", children: [greeting, ", Dr. Sam Sulek"] }), _jsxs("div", { className: "mt-4 flex items-center", children: [_jsx(MapPin, { className: "w-4 h-4 mr-1 text-gray-500" }), _jsx("span", { className: "text-sm text-gray-500 mr-1", children: "Primary Location:" }), _jsx("span", { className: "text-sm font-medium text-gray-700 mr-1", children: "Northwest Medical Center" }), _jsx(ChevronDown, { className: "w-3 h-3 text-gray-500" })] })] }), _jsxs("div", { className: "mb-6 lg:mb-0 lg:ml-8 lg:mr-8 flex-1", children: [_jsx("h3", { className: "text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3", children: "Today's Schedule" }), _jsx("div", { className: "space-y-3", children: upcomingAppointments.map((appointment, idx) => (_jsxs("div", { className: "flex items-center p-2 rounded-md hover:bg-white transition-colors", children: [_jsx("div", { className: "w-16 text-sm font-medium text-indigo-600", children: appointment.time }), _jsxs("div", { className: "ml-2", children: [_jsx("div", { className: "text-sm font-medium text-gray-800", children: appointment.patient }), _jsx("div", { className: "text-xs text-gray-500", children: appointment.type })] })] }, idx))) }), _jsx("div", { className: "mt-3 pt-3 border-t border-gray-100", children: _jsx(Button, { variant: "ghost", className: "text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0", children: "View full schedule \u2192" }) })] }), _jsx("div", { className: "flex flex-col items-center justify-center lg:pl-4 mr-30", children: _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border border-gray-100", children: [_jsxs(motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex flex-col items-center", children: [_jsxs(Button, { className: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-6 rounded-lg shadow-md", onClick: () => navigate('/scan'), children: [_jsx(PlusCircle, { className: "w-6 h-6 mr-2" }), "Join a Clinic"] }), _jsx("span", { className: "text-xs text-gray-500 mt-2", children: "Connect with new clinics in your network" })] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-100 w-full text-center", children: [_jsx("div", { className: "text-sm font-medium text-gray-800", children: "Clinics: 3" }), _jsx("div", { className: "text-xs text-gray-500", children: "Active collaborations" })] })] }) })] }) }) }) }) }));
};
export default DoctorDashboardHeader;
