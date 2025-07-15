import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';

import { 
  Package, 
  AlertCircle, 
  Clock, 
  Plus, 
  RefreshCw, 
  Search,
  Pill,
  Calendar,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Input } from '../components/ui/input.js';

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
    switch(type) {
      case 'antibiotic':
        return (
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-green-900" />
            <motion.div
              className="absolute inset-0 rounded-full border border-green-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        );
      case 'pain':
        return (
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-red-500" />
            <motion.div
              className="absolute inset-0 rounded-full border border-red-400"
              
            />
          </div>
        );
      case 'fever':
        return (
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Pill className="w-5 h-5 text-yellow-800" />
            <motion.div
              className="absolute inset-0 rounded-full border border-yellow-400"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        );
      default:
        return <Pill className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      {/* Top Navigation */}
      {/* <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Medicine Dispenser Management
          </motion.h1>
          <Button variant="outline" className="text-blue-500 hover:text-white hover:bg-blue-500 border-blue-200">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className=" shadow-lg">
              <CardContent className="flex items-center p-6">
                <Package className="w-10 h-10 text-black mr-4" />
                <div>
                  <p className="text-sm">Total Medicines</p>
                  <h3 className="text-3xl font-bold">250</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="bg-gradient-to-r from-gray-100 to-white-700 shadow-lg">
              <CardContent className="flex items-center p-6">
              <Clock className="w-10 h-10  mr-4" />
              <div>
                <p className="text-sm ">Dispensed Today</p>
                <h3 className="text-3xl font-bold ">45</h3>
              </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="bg-gradient-to-r from-red-50 to-white-100 shadow-lg">
              <CardContent className="flex items-center p-6">
                <AlertCircle className="w-10 h-10 text-red-500 mr-4" />
                <div>
                  <p className="text-sm text-red-500 ">Alerts</p>
                  <h3 className="text-3xl font-bold text-red-500">3</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Medicine Stock Table */}
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 bg-gradient-to-r from-purple-800 to-blue-600 text-white">
            <CardTitle className="text-2xl font-semibold">Medicine Stock</CardTitle>
            <div className="flex space-x-4">
              {/* <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
                <Input placeholder="Search medicines..." className="pl-8 py-2 border-blue-200 focus:border-blue-400 text-white" />
              </div> */}
              <Button className="bg-white text-black hover:text-white hover:bg-green-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>

              <Button variant="outline" className="text-blue-500 hover:text-white hover:bg-blue-500 border-blue-200">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left bg-blue-100">
                    <th className="py-3 px-6 text-black-600">Dispenser</th>
                    <th className="py-3 px-6 text-black-600">Medicine Name</th>
                    <th className="py-3 px-6 text-black-600">Stock Level</th>
                    <th className="py-3 px-6 text-black-600">Temperature</th>
                    <th className="py-3 px-6 text-black-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, idx) => (
                    <motion.tr 
                      key={idx} 
                      className="border-b hover:bg-blue-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.8)" }}
                    >
                      <td className="py-4 px-6">
                        {getMedicineAnimation(med.type)}
                      </td>
                      <td className="py-4 px-6 font-medium text-blue-800">{med.name}</td>
                      <td className="py-4 px-6">
                        <motion.div
                          className="bg-blue-100 rounded-full h-6 overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, med.stock / 2)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        >
                          <div className="bg-blue-500 h-full text-xs text-white flex items-center justify-center">
                            {med.stock} units
                          </div>
                        </motion.div>
                      </td>
                      <td className="py-4 px-6">{med.temperature}</td>
                      <td className="py-4 px-6">
                        <motion.span 
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(med.status)}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                        </motion.span>
                      </td>
                      <td className="py-4 px-6">
                        <Button variant="outline" className="mr-2 text-green-600 hover:bg-green-600 hover:text-white border-blue-200">
                          Dispense
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DispenserDashboard;